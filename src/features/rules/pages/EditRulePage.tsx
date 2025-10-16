import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ArrowLeft, FileCode, Search, X, AlertCircle, Eye, Plus, Code2, FormInput, HelpCircle, Loader2 } from "lucide-react";
import { ruleService } from "../api/service";
import { IRule } from "@/interfaces/rule.interface";
import { IIntent } from "@/interfaces/intent.interface";
import { IAction } from "@/interfaces/action.interface";
import { toast } from "sonner";

export function EditRulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Get rule from location state
  const stateRule = location.state?.rule as IRule | undefined;

  // Loading states
  const [isLoading, setIsLoading] = useState(!stateRule);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Form fields
  const [rule, setRule] = useState<IRule | null>(stateRule || null);
  const [name, setName] = useState(stateRule?.name || "");
  const [description, setDescription] = useState(stateRule?.description || "");
  const [yamlDefine, setYamlDefine] = useState(stateRule?.define || "");
  const [selectedIntents, setSelectedIntents] = useState<IIntent[]>([]);
  const [selectedActions, setSelectedActions] = useState<IAction[]>([]);
  const [selectedResponses, setSelectedResponses] = useState<any[]>([]);

  // Intent search
  const [intentSearchOpen, setIntentSearchOpen] = useState(false);
  const [intentSearchQuery, setIntentSearchQuery] = useState("");
  const [intentSearchResults, setIntentSearchResults] = useState<IIntent[]>([]);
  const [isSearchingIntents, setIsSearchingIntents] = useState(false);

  // Action search
  const [actionSearchOpen, setActionSearchOpen] = useState(false);
  const [actionSearchQuery, setActionSearchQuery] = useState("");
  const [actionSearchResults, setActionSearchResults] = useState<IAction[]>([]);
  const [isSearchingActions, setIsSearchingActions] = useState(false);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode toggle
  const [isExpertMode, setIsExpertMode] = useState(true); // Default to expert mode for editing

  // Load rule data if not provided in state
  useEffect(() => {
    if (!stateRule) {
      // Try to get rule ID from URL params or redirect back
      navigate("/rules");
      return;
    }

    if (stateRule) {
      setIsLoading(false);
      // Initialize form with rule data
      setName(stateRule.name);
      setDescription(stateRule.description);
      setYamlDefine(stateRule.define);

      // Initialize with populated data if available
      if (stateRule.intents && Array.isArray(stateRule.intents)) {
        const intentObjects = stateRule.intents.filter(intent => typeof intent === 'object') as IIntent[];
        setSelectedIntents(intentObjects);
      }

      if (stateRule.action && Array.isArray(stateRule.action)) {
        const actionObjects = stateRule.action.filter(action => typeof action === 'object') as IAction[];
        setSelectedActions(actionObjects);
      }

      if (stateRule.responses && Array.isArray(stateRule.responses)) {
        const responseObjects = stateRule.responses.filter(response => typeof response === 'object');
        setSelectedResponses(responseObjects);
      }
    }
  }, [stateRule, navigate]);

  // Search intents
  useEffect(() => {
    if (intentSearchQuery.length > 0) {
      const debounce = setTimeout(async () => {
        try {
          setIsSearchingIntents(true);
          const results = await ruleService.searchIntentForRule(intentSearchQuery);
          setIntentSearchResults(results);
        } catch (error) {
          console.error("Error searching intents:", error);
        } finally {
          setIsSearchingIntents(false);
        }
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setIntentSearchResults([]);
    }
  }, [intentSearchQuery]);

  // Search actions
  useEffect(() => {
    if (actionSearchQuery.length > 0) {
      const debounce = setTimeout(async () => {
        try {
          setIsSearchingActions(true);
          const results = await ruleService.searchActionForRule(actionSearchQuery);
          setActionSearchResults(results);
        } catch (error) {
          console.error("Error searching actions:", error);
        } finally {
          setIsSearchingActions(false);
        }
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setActionSearchResults([]);
    }
  }, [actionSearchQuery]);

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push(t("Rule name is required"));
    }

    if (!yamlDefine.trim()) {
      newErrors.push(t("YAML definition is required"));
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm() || !rule) return;

    try {
      setIsSubmitting(true);

      const updatedRule: IRule = {
        ...rule,
        name: name.trim(),
        description: description.trim(),
        define: yamlDefine,
        intents: selectedIntents.map(intent => typeof intent === 'string' ? intent : intent._id),
        action: selectedActions.map(action => typeof action === 'string' ? action : action._id), // Backend uses singular 'action'
        responses: selectedResponses.map(response => typeof response === 'string' ? response : response._id),
      };

      await ruleService.updateRule(rule._id, updatedRule);
      toast.success(t("Rule updated successfully"));
      navigate("/rules");
    } catch (error) {
      console.error("Error updating rule:", error);
      toast.error(t("Failed to update rule"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddIntent = (intent: IIntent) => {
    if (!selectedIntents.find(i => i._id === intent._id)) {
      setSelectedIntents([...selectedIntents, intent]);
    }
    setIntentSearchOpen(false);
    setIntentSearchQuery("");
  };

  const handleRemoveIntent = (intentId: string) => {
    setSelectedIntents(selectedIntents.filter(intent => intent._id !== intentId));
  };

  const handleAddAction = (action: IAction) => {
    if (!selectedActions.find(a => a._id === action._id)) {
      setSelectedActions([...selectedActions, action]);
    }
    setActionSearchOpen(false);
    setActionSearchQuery("");
  };

  const handleRemoveAction = (actionId: string) => {
    setSelectedActions(selectedActions.filter(action => action._id !== actionId));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  if (loadError || !rule) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="text-center py-12">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">{t("Error loading rule")}</h2>
          <p className="text-muted-foreground mb-4">
            {loadError || t("Rule not found or invalid data")}
          </p>
          <Button onClick={() => navigate("/rules")}>
            {t("Back to Rules")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => navigate("/rules")}
            className="p-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("Edit Rule")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("Modify the rule definition and settings")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => navigate(`/rules`)}
          >
            <Eye className="h-4 w-4 mr-2" />
            {t("View Details")}
          </Button>
        </div>
      </div>

      {/* Error Display */}
      {errors.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
            <div>
              <h3 className="font-medium text-red-800 mb-1">
                {t("Please fix the following errors:")}
              </h3>
              <ul className="text-sm text-red-700 space-y-1">
                {errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {/* Basic Information */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t("Basic Information")}</h2>
          <div className="grid gap-4">
            <div>
              <Label htmlFor="name" className="text-sm font-medium">
                {t("Rule Name")} *
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t("Enter rule name")}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="description" className="text-sm font-medium">
                {t("Description")}
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder={t("Enter rule description (optional)")}
                className="mt-1 min-h-20"
              />
            </div>
          </div>
        </div>

        {/* Rule Definition */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("Rule Definition")}</h2>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label htmlFor="yamlDefine" className="text-sm font-medium">
                {t("YAML Definition")} *
              </Label>
            </div>
            <Textarea
              id="yamlDefine"
              ref={textareaRef}
              value={yamlDefine}
              onChange={(e) => setYamlDefine(e.target.value)}
              placeholder={t("Enter YAML rule definition...")}
              className="font-mono text-sm min-h-80"
            />
          </div>
        </div>

        {/* Associated Resources */}
        <div className="bg-card rounded-lg border p-6">
          <h2 className="text-lg font-semibold mb-4">{t("Associated Resources")}</h2>

          {/* Intent Selection */}
          <div className="mb-6">
            <Label className="text-sm font-medium mb-3 block">{t("Associated Intents")}</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedIntents.map((intent) => (
                <Badge key={intent._id} variant="secondary" className="flex items-center gap-1">
                  {intent.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveIntent(intent._id)}
                  />
                </Badge>
              ))}
            </div>
            <Popover open={intentSearchOpen} onOpenChange={setIntentSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  {t("Add Intent")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Command>
                  <CommandInput
                    placeholder={t("Search intents...")}
                    value={intentSearchQuery}
                    onValueChange={setIntentSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isSearchingIntents ? t("Searching...") : t("No intents found")}
                    </CommandEmpty>
                    <CommandGroup>
                      {intentSearchResults.map((intent) => (
                        <CommandItem
                          key={intent._id}
                          onSelect={() => handleAddIntent(intent)}
                        >
                          <div>
                            <div className="font-medium">{intent.name}</div>
                            {intent.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {intent.description}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          {/* Action Selection */}
          <div>
            <Label className="text-sm font-medium mb-3 block">{t("Associated Actions")}</Label>
            <div className="flex flex-wrap gap-2 mb-3">
              {selectedActions.map((action) => (
                <Badge key={action._id} variant="outline" className="flex items-center gap-1">
                  {action.name}
                  <X
                    className="h-3 w-3 cursor-pointer"
                    onClick={() => handleRemoveAction(action._id)}
                  />
                </Badge>
              ))}
            </div>
            <Popover open={actionSearchOpen} onOpenChange={setActionSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <Search className="h-4 w-4 mr-2" />
                  {t("Add Action")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-0">
                <Command>
                  <CommandInput
                    placeholder={t("Search actions...")}
                    value={actionSearchQuery}
                    onValueChange={setActionSearchQuery}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isSearchingActions ? t("Searching...") : t("No actions found")}
                    </CommandEmpty>
                    <CommandGroup>
                      {actionSearchResults.map((action) => (
                        <CommandItem
                          key={action._id}
                          onSelect={() => handleAddAction(action)}
                        >
                          <div>
                            <div className="font-medium">{action.name}</div>
                            {action.description && (
                              <div className="text-sm text-muted-foreground truncate">
                                {action.description}
                              </div>
                            )}
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate("/rules")}
          >
            {t("Cancel")}
          </Button>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? t("Updating...") : t("Update Rule")}
          </Button>
        </div>
      </div>
    </div>
  );
}
