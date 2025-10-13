import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ArrowLeft, FileCode, Search, X, AlertCircle, Eye, Plus, Code2, FormInput, HelpCircle } from "lucide-react";
import { ruleService } from "../api/service";
import { IIntent } from "@/interfaces/intent.interface";
import { IAction } from "@/interfaces/action.interface";
import { IMyResponse } from "@/interfaces/response.interface";
import { toast } from "sonner";

export function CreateRulePage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form fields
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [yamlDefine, setYamlDefine] = useState("");

  // Step management
  const [ruleSteps, setRuleSteps] = useState<Array<{ id: string, type: 'intent' | 'action' | 'response', data: IIntent | IAction | IMyResponse }>>([]);
  const [nextStepType, setNextStepType] = useState<'intent' | 'action'>('intent');

  // Intent dialog state
  const [intentDialogOpen, setIntentDialogOpen] = useState(false);
  const [intentSearchQuery, setIntentSearchQuery] = useState("");
  const [intentSearchResults, setIntentSearchResults] = useState<IIntent[]>([]);
  const [isSearchingIntents, setIsSearchingIntents] = useState(false);

  // Action/Response dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionSearchQuery, setActionSearchQuery] = useState("");
  const [actionSearchResults, setActionSearchResults] = useState<IAction[]>([]);
  const [responseSearchQuery, setResponseSearchQuery] = useState("");
  const [responseSearchResults, setResponseSearchResults] = useState<IMyResponse[]>([]);
  const [isSearchingActions, setIsSearchingActions] = useState(false);
  const [isSearchingResponses, setIsSearchingResponses] = useState(false);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mode toggle
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Normal mode examples
  const [conditions, setConditions] = useState<string[]>(["", ""]);
  const [steps, setSteps] = useState<string[]>(["", ""]);

  // Help dialog state
  const [showHelp, setShowHelp] = useState(false);

  // Helper function to convert to snake_case
  const toSnakeCase = (str: string): string => {
    return str
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
      .replace(/_+/g, "_")
      .replace(/^_+|_+$/g, "");
  };

  // Update YAML when name changes
  useEffect(() => {
    generateYamlDefine(ruleSteps);
  }, [name]);

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

  // Search intents for dialog
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

  // Search responses for dialog
  useEffect(() => {
    if (responseSearchQuery.length > 0) {
      const debounce = setTimeout(async () => {
        try {
          setIsSearchingResponses(true);
          const results = await ruleService.searchResponseForRule(responseSearchQuery);
          setResponseSearchResults(results);
        } catch (error) {
          console.error("Error searching responses:", error);
        } finally {
          setIsSearchingResponses(false);
        }
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setResponseSearchResults([]);
    }
  }, [responseSearchQuery]);

  // Generate template
  const generateTemplate = () => {
    const sanitizedName = toSnakeCase(name) || "rule_name";
    const template = `- rule: ${sanitizedName}
  condition:
    - condition1
  steps:
    - intent: example_intent
    - action: action_example`;
    setYamlDefine(template);
    setErrors([]);
  };

  // Convert normal mode to YAML
  const convertNormalModeToYaml = () => {
    const sanitizedName = toSnakeCase(name) || "rule_name";
    let yaml = `- rule: ${sanitizedName}\n`;

    // Add conditions
    const validConditions = conditions.filter(condition => condition.trim() !== "");
    if (validConditions.length > 0) {
      yaml += "  condition:\n";
      validConditions.forEach(condition => {
        yaml += `    - ${condition.trim()}\n`;
      });
    }

    // Add steps
    const validSteps = steps.filter(step => step.trim() !== "");
    if (validSteps.length > 0) {
      yaml += "  steps:\n";
      validSteps.forEach(step => {
        if (step.trim().includes(':')) {
          yaml += `    - ${step.trim()}\n`;
        } else {
          yaml += `    - intent: ${step.trim()}\n`;
        }
      });
    }

    // Add rule steps
    ruleSteps.forEach(step => {
      const stepName = (step.data as any).name || step.data._id;
      if (step.type === 'intent') {
        if (!yaml.includes(`intent: ${stepName}`)) {
          yaml += `    - intent: ${stepName}\n`;
        }
      } else {
        if (!yaml.includes(`action: ${stepName}`)) {
          yaml += `    - action: ${stepName}\n`;
        }
      }
    });

    return yaml;
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push(t("Rule name is required"));
    }

    if (isExpertMode) {
      if (!yamlDefine.trim()) {
        newErrors.push(t("YAML definition is required"));
      }
    } else {
      const validConditions = conditions.filter(condition => condition.trim() !== "");
      const validSteps = steps.filter(step => step.trim() !== "");

      if (validConditions.length === 0 && validSteps.length === 0 && ruleSteps.length === 0) {
        newErrors.push(t("At least one condition or step is required"));
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setIsSubmitting(true);

      const finalYaml = isExpertMode ? yamlDefine : convertNormalModeToYaml();

      // Extract unique intents, actions, and responses from ruleSteps
      const usedIntents = ruleSteps
        .filter(step => step.type === 'intent')
        .map(step => step.data._id);
      const usedActions = ruleSteps
        .filter(step => step.type === 'action')
        .map(step => step.data._id);
      const usedResponses = ruleSteps
        .filter(step => step.type === 'response')
        .map(step => step.data._id);

      const ruleData = {
        name: name.trim(),
        description: description.trim(),
        define: yamlDefine || finalYaml, // Use the YAML string with \n and proper indentation
        intents: [...new Set(usedIntents)], // Unique intents - note the 's' 
        action: [...new Set(usedActions)], // Unique custom actions
        responses: [...new Set(usedResponses)], // Unique response actions
        roles: [], // Always send empty array if not used
      };

      await ruleService.createRule(ruleData);
      toast.success(t("Rule created successfully"));
      navigate("/rules");
    } catch (error) {
      console.error("Error creating rule:", error);
      toast.error(t("Failed to create rule"));
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step management functions
  const addIntentStep = () => {
    setIntentDialogOpen(true);
  };

  const addActionStep = () => {
    setActionDialogOpen(true);
  };

  const handleSelectIntent = (intent: IIntent) => {
    const stepId = `intent_${intent._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: 'intent' as const,
      data: intent
    };
    setRuleSteps(prev => [...prev, newStep]);
    setIntentDialogOpen(false);
    setIntentSearchQuery("");
    generateYamlDefine([...ruleSteps, newStep]);
  };

  const handleSelectAction = (action: IAction) => {
    const stepId = `action_${action._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: 'action' as const,
      data: action
    };
    setRuleSteps(prev => [...prev, newStep]);
    setActionDialogOpen(false);
    setActionSearchQuery("");
    generateYamlDefine([...ruleSteps, newStep]);
  };

  const handleSelectResponse = (response: IMyResponse) => {
    const stepId = `response_${response._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: 'response' as const, // Separate type for responses
      data: response as any
    };
    setRuleSteps(prev => [...prev, newStep]);
    setActionDialogOpen(false);
    setResponseSearchQuery("");
    generateYamlDefine([...ruleSteps, newStep]);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = ruleSteps.filter(step => step.id !== stepId);
    setRuleSteps(updatedSteps);
    generateYamlDefine(updatedSteps);
  };

  // Generate YAML define from steps
  const generateYamlDefine = (steps: typeof ruleSteps) => {
    const sanitizedName = toSnakeCase(name) || "rule_name";
    let yaml = `- rule: ${sanitizedName}\n`;

    if (steps.length > 0) {
      yaml += "  steps:\n";
      steps.forEach(step => {
        const stepId = step.data._id; // Use ID instead of name
        if (step.type === 'intent') {
          yaml += `    - intent: [${stepId}]\n`;
        } else if (step.type === 'action') {
          yaml += `    - action: [${stepId}]\n`;
        } else if (step.type === 'response') {
          yaml += `    - action: [${stepId}]\n`; // Responses are also actions in RASA YAML
        }
      });
    }

    setYamlDefine(yaml);
  };

  const addCondition = () => {
    setConditions([...conditions, ""]);
  };

  const removeCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const updateCondition = (index: number, value: string) => {
    const newConditions = [...conditions];
    newConditions[index] = value;
    setConditions(newConditions);
  };

  const addStepOld = () => {
    setSteps([...steps, ""]);
  };

  const removeStepOld = (index: number) => {
    setSteps(steps.filter((_, i) => i !== index));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...steps];
    newSteps[index] = value;
    setSteps(newSteps);
  };

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
            <h1 className="text-2xl font-bold">{t("Create New Rule")}</h1>
            <p className="text-sm text-muted-foreground">
              {t("Define conversation rules for your chatbot")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setShowHelp(true)}
          >
            <HelpCircle className="h-4 w-4 mr-2" />
            {t("Help")}
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

        {/* Mode Toggle */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">{t("Rule Definition")}</h2>
            <div className="flex items-center gap-2">
              <Button
                variant={!isExpertMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsExpertMode(false)}
              >
                <FormInput className="h-4 w-4 mr-2" />
                {t("Normal Mode")}
              </Button>
              <Button
                variant={isExpertMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsExpertMode(true)}
              >
                <Code2 className="h-4 w-4 mr-2" />
                {t("Expert Mode")}
              </Button>
            </div>
          </div>

          {!isExpertMode ? (
            // Normal Mode
            <div className="space-y-6">
              {/* Conditions */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">{t("Conditions")}</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addCondition}
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    {t("Add Condition")}
                  </Button>
                </div>
                <div className="space-y-2">
                  {conditions.map((condition, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Input
                        value={condition}
                        onChange={(e) => updateCondition(index, e.target.value)}
                        placeholder={t("Enter condition")}
                        className="flex-1"
                      />
                      {conditions.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCondition(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label className="text-sm font-medium">{t("Steps")}</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addIntentStep}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("Add Intent")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={addActionStep}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("Add Action")}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  {ruleSteps.map((step) => (
                    <div key={step.id} className="flex items-center gap-2 p-2 border rounded-md bg-muted/50">
                      <Badge variant={
                        step.type === 'intent' ? 'default' :
                          step.type === 'action' ? 'secondary' : 'outline'
                      }>
                        {step.type === 'intent' ? 'Intent' :
                          step.type === 'action' ? 'Action' : 'Response'}
                      </Badge>
                      <span className="flex-1 text-sm">
                        {(step.data as any).name || step.data._id}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeStep(step.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {ruleSteps.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      {t("No steps added yet. Click 'Add Step' to start building your rule.")}
                    </div>
                  )}
                </div>
              </div>




              {/* Preview */}
              <div>
                <Label className="text-sm font-medium mb-2 block">{t("Preview")}</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {convertNormalModeToYaml()}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            // Expert Mode
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label htmlFor="yamlDefine" className="text-sm font-medium">
                  {t("YAML Definition")} *
                </Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={generateTemplate}
                >
                  <FileCode className="h-4 w-4 mr-2" />
                  {t("Generate Template")}
                </Button>
              </div>
              <Textarea
                id="yamlDefine"
                ref={textareaRef}
                value={yamlDefine}
                onChange={(e) => setYamlDefine(e.target.value)}
                placeholder={t("Enter YAML rule definition...")}
                className="font-mono text-sm min-h-60"
              />
            </div>
          )}
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
            {isSubmitting ? t("Creating...") : t("Create Rule")}
          </Button>
        </div>
      </div>

      {/* Intent Dialog */}
      <Dialog open={intentDialogOpen} onOpenChange={setIntentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Select Intent</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              placeholder="Search intents..."
              value={intentSearchQuery}
              onChange={(e) => setIntentSearchQuery(e.target.value)}
            />
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {intentSearchResults.map((intent) => (
                <div
                  key={intent._id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectIntent(intent)}
                >
                  <p className="font-medium">{intent.name}</p>
                  {intent.description && (
                    <p className="text-sm text-muted-foreground mt-1">{intent.description}</p>
                  )}
                </div>
              ))}
              {intentSearchQuery && intentSearchResults.length === 0 && !isSearchingIntents && (
                <div className="p-4 text-center text-muted-foreground">
                  No intents found
                </div>
              )}
              {isSearchingIntents && (
                <div className="p-4 text-center text-muted-foreground">
                  Searching...
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Action/Response Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Select Action or Response</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Custom Actions Section */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Custom Actions</Label>
              <Input
                placeholder="Search custom actions..."
                value={actionSearchQuery}
                onChange={(e) => setActionSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {actionSearchResults.map((action) => (
                  <div
                    key={action._id}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectAction(action)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">Action</Badge>
                      <p className="font-medium">{action.name}</p>
                    </div>
                    {action.description && (
                      <p className="text-sm text-muted-foreground mt-1">{action.description}</p>
                    )}
                  </div>
                ))}
                {actionSearchQuery && actionSearchResults.length === 0 && !isSearchingActions && (
                  <div className="p-4 text-center text-muted-foreground">
                    No custom actions found
                  </div>
                )}
                {isSearchingActions && (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>
            </div>

            {/* Responses Section */}
            <div className="space-y-4">
              <Label className="text-lg font-medium">Response Actions</Label>
              <Input
                placeholder="Search responses..."
                value={responseSearchQuery}
                onChange={(e) => setResponseSearchQuery(e.target.value)}
              />
              <div className="max-h-60 overflow-y-auto border rounded-md">
                {responseSearchResults.map((response) => (
                  <div
                    key={response._id}
                    className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                    onClick={() => handleSelectResponse(response)}
                  >
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">Response</Badge>
                      <p className="font-medium">{response.name}</p>
                    </div>
                    {response.description && (
                      <p className="text-sm text-muted-foreground mt-1">{response.description}</p>
                    )}
                  </div>
                ))}
                {responseSearchQuery && responseSearchResults.length === 0 && !isSearchingResponses && (
                  <div className="p-4 text-center text-muted-foreground">
                    No responses found
                  </div>
                )}
                {isSearchingResponses && (
                  <div className="p-4 text-center text-muted-foreground">
                    Searching...
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
