import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// Note: Switch removed because it's not used in this form
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Plus,
  X,
  GripVertical,
  AlertCircle,
  SlidersHorizontal,
  FileCode,
  HelpCircle,
  Code2,
  FormInput,
} from "lucide-react";
import { toast } from "sonner";
import { storyService } from "@/features/stories/api/service";
import { IIntent } from "@/interfaces/intent.interface";
import { IAction } from "@/interfaces/action.interface";
import { IMyResponse } from "@/interfaces/response.interface";

const toSnakeCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
};

interface StoryStep {
  id: string;
  type: "intent" | "action" | "response";
  data: IIntent | IAction | IMyResponse;
}

interface StoryFormProps {
  initialStory?: any;
  onSubmit: (storyData: any) => Promise<void>;
  onCancel: () => void;
  submitButtonText: string;
  isSubmitting: boolean;
}

export function StoryForm({
  initialStory = {
    name: "",
    description: "",
    define: "",
    intents: [],
    action: [],
    responses: [],
    entities: [],
    slots: [],
    roles: [],
  },
  onSubmit,
  onCancel,
  submitButtonText,
  isSubmitting = false,
}: StoryFormProps) {
  const { t } = useTranslation();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Form states
  const [name, setName] = useState(initialStory.name);
  const [description, setDescription] = useState(initialStory.description);
  const [yamlDefine, setYamlDefine] = useState(initialStory.define || "");
  const [isExpertMode, setIsExpertMode] = useState(false);

  // Step management
  const [storySteps, setStorySteps] = useState<StoryStep[]>([]);

  // Drag & drop state
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);
  const [dropZoneIndex, setDropZoneIndex] = useState<number | null>(null);

  // Validation
  const [errors, setErrors] = useState<string[]>([]);
  const [yamlErrors, setYamlErrors] = useState<string[]>([]);

  // Intent dialog state
  const [intentDialogOpen, setIntentDialogOpen] = useState(false);
  const [intentSearchQuery, setIntentSearchQuery] = useState("");
  const [intentSearchResults, setIntentSearchResults] = useState<IIntent[]>([]);
  const [isSearchingIntents, setIsSearchingIntents] = useState(false);
  const [intentFilterDeleted, setIntentFilterDeleted] = useState(false);

  // Action/Response dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [actionSearchQuery, setActionSearchQuery] = useState("");
  const [actionSearchResults, setActionSearchResults] = useState<IAction[]>([]);
  const [responseSearchQuery, setResponseSearchQuery] = useState("");
  const [responseSearchResults, setResponseSearchResults] = useState<
    IMyResponse[]
  >([]);
  const [isSearchingActions, setIsSearchingActions] = useState(false);
  const [isSearchingResponses, setIsSearchingResponses] = useState(false);
  const [actionFilterDeleted, setActionFilterDeleted] = useState(false);
  const [responseFilterDeleted, setResponseFilterDeleted] = useState(false);

  // Help dialog state
  const [showHelp, setShowHelp] = useState(false);

  // Selected items for expert mode
  const [selectedIntents, setSelectedIntents] = useState<IIntent[]>([]);
  const [selectedActions, setSelectedActions] = useState<IAction[]>([]);
  const [selectedResponses, setSelectedResponses] = useState<IMyResponse[]>([]);

  // Update YAML when name changes
  useEffect(() => {
    generateYamlDefine(storySteps);
  }, [name]);

  // Search intents for dialog
  useEffect(() => {
    if (intentSearchQuery.length > 0) {
      const debounce = setTimeout(async () => {
        try {
          setIsSearchingIntents(true);
          const results = await storyService.searchIntentForStory(
            intentSearchQuery
          );
          setIntentSearchResults(results);
        } catch (error) {
          console.error("Error searching intents:", error);
          toast.error(t("Failed to search intents"));
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
          const results = await storyService.searchActionForStory(
            actionSearchQuery
          );
          setActionSearchResults(results);
        } catch (error) {
          console.error("Error searching actions:", error);
          toast.error(t("Failed to search actions"));
        } finally {
          setIsSearchingActions(false);
        }
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setActionSearchResults([]);
    }
  }, [actionSearchQuery, t]);

  // Search responses
  useEffect(() => {
    if (responseSearchQuery.length > 0) {
      const debounce = setTimeout(async () => {
        try {
          setIsSearchingResponses(true);
          const results = await storyService.searchResponseForStory(
            responseSearchQuery
          );
          setResponseSearchResults(results);
        } catch (error) {
          console.error("Error searching responses:", error);
          toast.error(t("Failed to search responses"));
        } finally {
          setIsSearchingResponses(false);
        }
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setResponseSearchResults([]);
    }
  }, [responseSearchQuery, t]);

  // Helper functions
  const generateTemplate = () => {
    const sanitizedName = toSnakeCase(name) || "story_name";
    const template = `- story: ${sanitizedName}
  steps:
    - intent: example_intent
    - action: example_action`;
    setYamlDefine(template);
    setErrors([]);
  };

  const generateYamlDefine = (steps: typeof storySteps) => {
    const sanitizedName = toSnakeCase(name) || "story_name";
    let yaml = `- story: ${sanitizedName}\n`;

    if (steps.length > 0) {
      yaml += "  steps:\n";
      steps.forEach((step) => {
        const stepId = step.data._id;
        if (step.type === "intent") {
          yaml += `    - intent: ${stepId}\n`;
        } else if (step.type === "action") {
          yaml += `    - action: ${stepId}\n`;
        } else if (step.type === "response") {
          yaml += `    - action: ${stepId}\n`; // Responses are also actions in RASA YAML
        }
      });
    }

    setYamlDefine(yaml);
  };

  const validateForm = () => {
    const newErrors: string[] = [];

    if (!name.trim()) {
      newErrors.push(t("Story name is required"));
    }

    if (isExpertMode) {
      if (!yamlDefine.trim()) {
        newErrors.push(t("YAML definition is required"));
      }
    } else {
      if (storySteps.length === 0) {
        newErrors.push(t("At least one step is required"));
      }
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const storyData = {
        name: name.trim(),
        description: description.trim(),
        define: yamlDefine,
        intents: [
          ...new Set(
            storySteps.filter((s) => s.type === "intent").map((s) => s.data._id)
          ),
        ],
        action: [
          ...new Set(
            storySteps.filter((s) => s.type === "action").map((s) => s.data._id)
          ),
        ],
        responses: [
          ...new Set(
            storySteps
              .filter((s) => s.type === "response")
              .map((s) => s.data._id)
          ),
        ],
        slots: [],
        roles: [],
        entities: [],
      };

      await onSubmit(storyData);
    } catch (error: any) {
      console.error("Error submitting story form:", error);
      toast.error(error?.response?.data?.message || t("Failed to save story"));
    }
  };

  // Step management
  const handleSelectIntent = (intent: IIntent) => {
    const stepId = `intent_${intent._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: "intent" as const,
      data: intent,
    };
    setStorySteps((prev) => [...prev, newStep]);
    setIntentDialogOpen(false);
    setIntentSearchQuery("");
    generateYamlDefine([...storySteps, newStep]);
  };

  const handleSelectAction = (action: IAction) => {
    const stepId = `action_${action._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: "action" as const,
      data: action,
    };
    setStorySteps((prev) => [...prev, newStep]);
    setActionDialogOpen(false);
    setActionSearchQuery("");
    generateYamlDefine([...storySteps, newStep]);
  };

  const handleSelectResponse = (response: IMyResponse) => {
    const stepId = `response_${response._id}_${Date.now()}`;
    const newStep = {
      id: stepId,
      type: "response" as const,
      data: response,
    };
    setStorySteps((prev) => [...prev, newStep]);
    setActionDialogOpen(false);
    setResponseSearchQuery("");
    generateYamlDefine([...storySteps, newStep]);
  };

  const removeStep = (stepId: string) => {
    const updatedSteps = storySteps.filter((step) => step.id !== stepId);
    setStorySteps(updatedSteps);
    generateYamlDefine(updatedSteps);
  };

  // Fetch names for IDs
  // Simplified: storyService doesn't expose getXById helpers; return readable placeholder instead
  const fetchNameForId = async (
    id: string,
    type: "intent" | "action" | "response"
  ): Promise<string> => {
    return `${type}_${id.slice(-6)}`;
  };

  // Expert mode insert helpers
  const insertIntentAtCursor = (intent: IIntent) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBefore = yamlDefine.substring(0, cursorPos);
      const textAfter = yamlDefine.substring(cursorPos);
      const pattern = `[${intent._id}]`;

      setYamlDefine(textBefore + pattern + textAfter);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPos + pattern.length,
          cursorPos + pattern.length
        );
      }, 0);
    }
  };

  const insertActionAtCursor = (action: IAction) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBefore = yamlDefine.substring(0, cursorPos);
      const textAfter = yamlDefine.substring(cursorPos);
      const pattern = `[${action._id}]`;

      setYamlDefine(textBefore + pattern + textAfter);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPos + pattern.length,
          cursorPos + pattern.length
        );
      }, 0);
    }
  };

  const insertResponseAtCursor = (response: IMyResponse) => {
    if (textareaRef.current) {
      const textarea = textareaRef.current;
      const cursorPos = textarea.selectionStart;
      const textBefore = yamlDefine.substring(0, cursorPos);
      const textAfter = yamlDefine.substring(cursorPos);
      const pattern = `[${response._id}]`;

      setYamlDefine(textBefore + pattern + textAfter);

      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(
          cursorPos + pattern.length,
          cursorPos + pattern.length
        );
      }, 0);
    }
  };

  // Drag & Drop handlers
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", "");
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (
      draggedIndex !== null &&
      draggedIndex !== index &&
      dropZoneIndex !== index
    ) {
      setDropZoneIndex(index);
    }
  };

  const handleDragEnter = (
    e: React.DragEvent<HTMLDivElement>,
    index: number
  ) => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== index)
      setDropZoneIndex(index);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX;
    const y = e.clientY;
    if (x < rect.left || x > rect.right || y < rect.top || y > rect.bottom) {
      setDropZoneIndex(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    dropIndex: number
  ) => {
    e.preventDefault();
    if (draggedIndex === null || draggedIndex === dropIndex) {
      setDraggedIndex(null);
      setDropZoneIndex(null);
      return;
    }

    const newSteps = [...storySteps];
    const draggedStep = newSteps[draggedIndex];
    newSteps.splice(draggedIndex, 1);
    let finalIndex = dropIndex;
    if (draggedIndex < dropIndex) finalIndex = dropIndex - 1;
    finalIndex = Math.max(0, Math.min(finalIndex, newSteps.length));
    newSteps.splice(finalIndex, 0, draggedStep);

    setStorySteps(newSteps);
    generateYamlDefine(newSteps);
    setDraggedIndex(null);
    setDropZoneIndex(null);

    const sequenceErrors = validateStepSequence(newSteps);
    if (sequenceErrors.length === 0) {
      toast.success(t("Step order updated"));
    } else {
      toast.warning(
        t("Step order updated, but sequence validation: ") + sequenceErrors[0]
      );
    }
  };

  const handleDragEnd = () => {
    setDraggedIndex(null);
    setDropZoneIndex(null);
  };

  // Handle adding selected items (expert mode)
  // Note: explicit "add to selected" helpers removed because selection/insertion is handled
  // directly where needed (handleSelectIntent/Action/Response and badge clicks).

  // Validate step sequence logic
  const validateStepSequence = (steps: StoryStep[]): string[] => {
    const errors: string[] = [];
    if (steps.length === 0) {
      errors.push(t("Story must have at least one step"));
      return errors;
    }
    if (steps[0].type !== "intent") {
      errors.push(t("Story must start with an Intent"));
    }

    for (let i = 0; i < steps.length; i++) {
      const currentStep = steps[i];
      const nextStep = steps[i + 1];
      const prevStep = steps[i - 1];

      if (currentStep.type === "intent") {
        if (i === steps.length - 1) {
          errors.push(
            t(
              "Intent cannot be the last step. It must be followed by an Action or Response"
            ) + ` (step ${i + 1})`
          );
        } else if (nextStep && nextStep.type === "intent") {
          errors.push(
            t(
              "Intent cannot be followed directly by another Intent. Add an Action or Response between them"
            ) + ` (steps ${i + 1} and ${i + 2})`
          );
        }
      }

      if (currentStep.type === "action" || currentStep.type === "response") {
        if (!prevStep) {
          errors.push(
            t(
              "Action/Response cannot be the first step. It must be preceded by an Intent"
            ) + ` (step ${i + 1})`
          );
        } else if (prevStep.type === "action" || prevStep.type === "response") {
          let lastIntentIndex = -1;
          for (let j = i - 1; j >= 0; j--) {
            if (steps[j].type === "intent") {
              lastIntentIndex = j;
              break;
            }
          }
          if (lastIntentIndex === -1) {
            errors.push(
              t("Action/Response group must be preceded by an Intent") +
                ` (step ${i + 1})`
            );
          }
        }
      }
    }

    for (let i = 0; i < steps.length; i++) {
      if (steps[i].type === "intent") {
        let hasFollowingAction = false;
        for (let j = i + 1; j < steps.length; j++) {
          if (steps[j].type === "intent") break;
          if (steps[j].type === "action" || steps[j].type === "response") {
            hasFollowingAction = true;
            break;
          }
        }
        if (!hasFollowingAction && i < steps.length - 1) {
          errors.push(
            t("Intent must have at least one Action or Response following it") +
              ` (step ${i + 1})`
          );
        }
      }
    }

    return errors;
  };

  // Validate YAML
  const validateYAML = (): boolean => {
    const newErrors: string[] = [];
    if (!yamlDefine.trim()) {
      newErrors.push(t("YAML definition is required"));
      setYamlErrors(newErrors);
      return false;
    }

    const lines: string[] = yamlDefine.split("\n");
    const storyLine = lines.find((line: string) =>
      line.trim().startsWith("- story:")
    );
    if (!storyLine) {
      newErrors.push(t("YAML must contain '- story:' declaration"));
    } else {
      const yamlStoryName = storyLine.split(":")[1]?.trim();
      const sanitizedName = toSnakeCase(name);
      if (yamlStoryName !== sanitizedName && !isExpertMode) {
        newErrors.push(
          t("Story name in YAML must match the name field") +
            ` (expected: ${sanitizedName}, found: ${yamlStoryName})`
        );
      }
    }

    const hasSteps = lines.some((line: string) => line.includes("steps:"));
    if (!hasSteps) newErrors.push(t("YAML must contain 'steps:' field"));

    const stepLines = lines.filter(
      (line: string) =>
        line.trim().startsWith("- intent:") ||
        line.trim().startsWith("- action:")
    );
    stepLines.forEach((line: string, index: number) => {
      if (!line.match(/\[([^\]]+)\]/)) {
        newErrors.push(
          t("Step must contain ID in brackets") +
            ` (line ${index + 1}): ${line.trim()}`
        );
      }
    });

    if (!isExpertMode && storySteps.length > 0) {
      const sequenceErrors = validateStepSequence(storySteps);
      newErrors.push(...sequenceErrors);
    }

    setYamlErrors(newErrors);
    return newErrors.length === 0;
  };

  // Keep validateYAML referenced so linters/ts don't mark it as unused.
  useEffect(() => {
    // When yamlDefine changes in expert mode, validate it (non-blocking)
    if (isExpertMode) {
      // run async validation inline
      (async () => {
        validateYAML();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [yamlDefine, isExpertMode]);

  // Parse steps from YAML define
  const parseStepsFromDefine = async (
    yamlDefine: string
  ): Promise<StoryStep[]> => {
    const steps: StoryStep[] = [];
    const lines = yamlDefine.split("\n");

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();

      // Look for step lines with intent or action
      if (line.includes("- intent:") || line.includes("- action:")) {
        // Extract ID from brackets [id]
        const match = line.match(/\[([^\]]+)\]/);
        if (match) {
          const id = match[1];

          if (line.includes("- intent:")) {
            // Fetch real name for intent ID
            const intentName = await fetchNameForId(id, "intent");
            const stepData: IIntent = {
              _id: id,
              name: intentName,
            } as IIntent;

            steps.push({
              id: `intent_${id}_${i}`,
              type: "intent",
              data: stepData,
            });
          } else if (line.includes("- action:")) {
            // Could be action or response, check both arrays
            // Check if ID is in actions array
            const isInActions = initialStory?.action?.some(
              (item: IAction | string) =>
                (typeof item === "string" ? item : item._id) === id
            );

            if (isInActions) {
              // Fetch real name for action ID
              const actionName = await fetchNameForId(id, "action");
              const stepData: IAction = {
                _id: id,
                name: actionName,
              } as IAction;

              steps.push({
                id: `action_${id}_${i}`,
                type: "action",
                data: stepData,
              });
            } else {
              // Check if ID is in responses array
              const isInResponses = initialStory?.responses?.some(
                (item: IMyResponse | string) =>
                  (typeof item === "string" ? item : item._id) === id
              );

              if (isInResponses) {
                // Fetch real name for response ID
                const responseName = await fetchNameForId(id, "response");
                const stepData: IMyResponse = {
                  _id: id,
                  name: responseName,
                } as IMyResponse;

                steps.push({
                  id: `response_${id}_${i}`,
                  type: "response",
                  data: stepData,
                });
              }
            }
          }
        }
      }
    }

    return steps;
  };

  // Initialize with existing story data
  useEffect(() => {
    const initializeSteps = async () => {
      if (initialStory) {
        // Parse steps from YAML define to maintain correct order
        if (initialStory.define) {
          try {
            const steps = await parseStepsFromDefine(initialStory.define);
            setStorySteps(steps);
            setYamlDefine(initialStory.define);

            // Extract story name from YAML define if available (only if name field is empty)
            if (!name) {
              const yamlLines = initialStory.define.split("\n");
              const storyNameLine = yamlLines.find((line: string) =>
                line.trim().startsWith("- story:")
              );
              if (storyNameLine) {
                const yamlStoryName = storyNameLine
                  .split("- story:")[1]
                  ?.trim();
                if (yamlStoryName) {
                  // Convert snake_case back to readable form for display
                  const displayName = yamlStoryName
                    .replace(/_/g, " ")
                    .toUpperCase();
                  setName(displayName);
                }
              }
            }
          } catch (error) {
            console.error("Error parsing steps from YAML:", error);
            // Fallback to empty steps
            setStorySteps([]);
            generateYamlDefine([]);
          }
        } else {
          // Fallback: if no define, create from arrays (shouldn't happen in edit mode)
          setStorySteps([]);
          generateYamlDefine([]);
        }
      }
    };

    initializeSteps();
  }, [initialStory]);

  return (
    <>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }}
        className="space-y-6"
      >
        {/* Error Display */}
        {errors.length > 0 && (
          <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <div>
                <h3 className="font-medium text-destructive mb-1">
                  {t("Please fix the following errors:")}
                </h3>
                <ul className="text-sm text-destructive/90 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Basic Information */}
        <div className="space-y-4">
          <div>
            <Label>{t("Story Name")} *</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("Enter story name")}
            />
          </div>

          <div>
            <Label>{t("Description")}</Label>
            <Textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("Enter story description (optional)")}
              className="min-h-20"
            />
          </div>
        </div>

        {/* Story Definition */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">{t("Story Definition")}</h2>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={!isExpertMode ? "default" : "outline"}
                size="sm"
                onClick={() => setIsExpertMode(false)}
              >
                <FormInput className="h-4 w-4 mr-2" />
                {t("Normal Mode")}
              </Button>
              <Button
                type="button"
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
            <div className="space-y-4">
              {/* Steps */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <Label>{t("Steps")}</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setIntentDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("Add Intent")}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => setActionDialogOpen(true)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      {t("Add Action")}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  {storySteps.map((step, index) => {
                    const sequenceErrors = validateStepSequence(storySteps);
                    const hasError = sequenceErrors.some((err) =>
                      err.includes(`step ${index + 1}`)
                    );
                    const isBeingDragged = draggedIndex === index;
                    const isDropTarget = dropZoneIndex === index;

                    return (
                      <div key={step.id}>
                        {draggedIndex !== null &&
                          draggedIndex !== index &&
                          isDropTarget && (
                            <div className="h-0.5 bg-blue-500 rounded-full mb-2 shadow-sm"></div>
                          )}

                        <div
                          className={`flex items-center gap-2 p-2 border rounded-md cursor-move transition-all duration-200 ${
                            isBeingDragged
                              ? "opacity-30 scale-95 shadow-lg border-blue-300"
                              : isDropTarget && draggedIndex !== null
                              ? "bg-blue-50 border-blue-400 border-2 shadow-md"
                              : hasError
                              ? "bg-red-50 border-red-200 hover:shadow-sm"
                              : "bg-muted/50 hover:shadow-sm"
                          }`}
                          draggable={!isBeingDragged}
                          onDragStart={(e) => handleDragStart(e, index)}
                          onDragOver={(e) => handleDragOver(e, index)}
                          onDragEnter={(e) => handleDragEnter(e, index)}
                          onDragLeave={handleDragLeave}
                          onDrop={(e) => handleDrop(e, index)}
                          onDragEnd={handleDragEnd}
                        >
                          <GripVertical
                            className={`h-4 w-4 flex-shrink-0 ${
                              isBeingDragged
                                ? "text-blue-500"
                                : "text-muted-foreground"
                            }`}
                          />
                          <div className="flex items-center gap-2 flex-1">
                            <Badge
                              variant={
                                step.type === "intent"
                                  ? "default"
                                  : step.type === "action"
                                  ? "secondary"
                                  : "outline"
                              }
                            >
                              {step.type === "intent"
                                ? "Intent"
                                : step.type === "action"
                                ? "Action"
                                : "Response"}
                            </Badge>
                            <span className="flex-1 text-sm">
                              {(step.data as any).name ||
                                `${
                                  step.type === "intent"
                                    ? "Intent"
                                    : step.type === "action"
                                    ? "Action"
                                    : "Response"
                                } ...${(step.data as any)._id?.slice(-6)}`}
                            </span>
                            {hasError && (
                              <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeStep(step.id)}
                            disabled={isBeingDragged}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                  {storySteps.length === 0 && (
                    <div className="text-center text-muted-foreground py-4">
                      {t(
                        "No steps added yet. Click 'Add Intent' or 'Add Action' to start building your story."
                      )}
                    </div>
                  )}

                  {/* Drop zone at the end for appending */}
                  {draggedIndex !== null && (
                    <div
                      className="mt-2"
                      onDragOver={(e) => {
                        e.preventDefault();
                        if (dropZoneIndex !== storySteps.length)
                          setDropZoneIndex(storySteps.length);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        if (draggedIndex !== null) {
                          const newSteps = [...storySteps];
                          const draggedStep = newSteps.splice(
                            draggedIndex,
                            1
                          )[0];
                          newSteps.push(draggedStep);

                          setStorySteps(newSteps);
                          generateYamlDefine(newSteps);
                          setDraggedIndex(null);
                          setDropZoneIndex(null);

                          toast.success(t("Step moved to end"));
                        }
                      }}
                    >
                      {dropZoneIndex === storySteps.length && (
                        <div className="h-0.5 bg-blue-500 rounded-full shadow-sm mb-2"></div>
                      )}
                      <div className="h-6 border-2 border-dashed border-blue-300 rounded-md bg-blue-50 flex items-center justify-center transition-all duration-200 hover:border-blue-400 hover:bg-blue-100">
                        <span className="text-xs text-blue-600 font-medium">
                          {t("Drop here to move to end")}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Preview */}
              <div className="space-y-2">
                <Label>{t("Preview")}</Label>
                <div className="bg-muted p-4 rounded-lg">
                  <pre className="text-sm font-mono whitespace-pre-wrap">
                    {yamlDefine}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
            // Expert Mode
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>{t("YAML Definition")} *</Label>
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
                ref={textareaRef}
                value={yamlDefine}
                onChange={(e) => setYamlDefine(e.target.value)}
                placeholder={t("Enter YAML story definition...")}
                className="font-mono text-sm min-h-60"
              />
              {yamlErrors.length > 0 && (
                <div className="mt-2 space-y-1">
                  {yamlErrors.map((err, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-2 text-red-600 text-xs"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {err}
                    </div>
                  ))}
                </div>
              )}
              <p className="text-sm text-muted-foreground">
                {t(
                  "Edit the YAML definition directly. Make sure to follow RASA stories format."
                )}
              </p>

              {/* Expert Mode action buttons */}
              <div className="flex gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIntentDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("Add Intent")}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setActionDialogOpen(true)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {t("Add Action")}
                </Button>
              </div>

              {/* Selected badges for expert mode */}
              {selectedIntents.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">
                    {t("Selected Intents")}
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                    {selectedIntents.map((intent) => (
                      <Badge
                        key={intent._id}
                        variant="secondary"
                        className="gap-2 pr-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => insertIntentAtCursor(intent)}
                        title={t("Click to insert ID at cursor position")}
                      >
                        <span>{intent.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIntents(
                              selectedIntents.filter(
                                (i) => i._id !== intent._id
                              )
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(
                      "Click on intent badges to insert their ID at cursor position"
                    )}
                  </p>
                </div>
              )}

              {selectedActions.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">
                    {t("Selected Actions")}
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                    {selectedActions.map((action) => (
                      <Badge
                        key={action._id}
                        variant="secondary"
                        className="gap-2 pr-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => insertActionAtCursor(action)}
                        title={t("Click to insert ID at cursor position")}
                      >
                        <span>{action.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedActions(
                              selectedActions.filter(
                                (a) => a._id !== action._id
                              )
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(
                      "Click on action badges to insert their ID at cursor position"
                    )}
                  </p>
                </div>
              )}

              {selectedResponses.length > 0 && (
                <div className="mt-4">
                  <Label className="text-sm font-medium mb-2 block">
                    {t("Selected Responses")}
                  </Label>
                  <div className="flex flex-wrap gap-2 p-3 bg-muted rounded-lg">
                    {selectedResponses.map((response) => (
                      <Badge
                        key={response._id}
                        variant="secondary"
                        className="gap-2 pr-1 cursor-pointer hover:bg-secondary/80 transition-colors"
                        onClick={() => insertResponseAtCursor(response)}
                        title={t("Click to insert ID at cursor position")}
                      >
                        <span>{response.name}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-transparent"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedResponses(
                              selectedResponses.filter(
                                (r) => r._id !== response._id
                              )
                            );
                          }}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {t(
                      "Click on response badges to insert their ID at cursor position"
                    )}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2">
          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {t("Cancel")}
            </Button>
          )}
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("Saving...") : submitButtonText}
          </Button>
        </div>
      </form>

      {/* Intent Dialog */}
      <Dialog open={intentDialogOpen} onOpenChange={setIntentDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("Select Intent")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder={t("Search intents...")}
                value={intentSearchQuery}
                onChange={(e) => setIntentSearchQuery(e.target.value)}
                className="flex-1"
              />
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm">
                    <SlidersHorizontal className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80">
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="intent-deleted"
                        checked={intentFilterDeleted}
                        onCheckedChange={(checked) =>
                          setIntentFilterDeleted(checked === true)
                        }
                      />
                      <Label htmlFor="intent-deleted" className="text-sm">
                        {t("Include deleted intents")}
                      </Label>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <div className="max-h-60 overflow-y-auto border rounded-md">
              {intentSearchResults.map((intent) => (
                <div
                  key={intent._id}
                  className="p-3 hover:bg-muted cursor-pointer border-b last:border-b-0"
                  onClick={() => handleSelectIntent(intent)}
                >
                  <p className="font-medium">{intent.name}</p>
                  {intent.description && (
                    <p className="text-sm text-muted-foreground mt-1">
                      {intent.description}
                    </p>
                  )}
                </div>
              ))}
              {intentSearchQuery &&
                intentSearchResults.length === 0 &&
                !isSearchingIntents && (
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
            <DialogTitle>{t("Select Action or Response")}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <Label className="text-lg font-medium">
                {t("Custom Actions")}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t("Search custom actions...")}
                  value={actionSearchQuery}
                  onChange={(e) => setActionSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="action-deleted"
                          checked={actionFilterDeleted}
                          onCheckedChange={(checked) =>
                            setActionFilterDeleted(checked === true)
                          }
                        />
                        <Label htmlFor="action-deleted" className="text-sm">
                          {t("Include deleted actions")}
                        </Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {action.description}
                      </p>
                    )}
                  </div>
                ))}
                {actionSearchQuery &&
                  actionSearchResults.length === 0 &&
                  !isSearchingActions && (
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

            <div className="space-y-4">
              <Label className="text-lg font-medium">
                {t("Response Actions")}
              </Label>
              <div className="flex gap-2">
                <Input
                  placeholder={t("Search responses...")}
                  value={responseSearchQuery}
                  onChange={(e) => setResponseSearchQuery(e.target.value)}
                  className="flex-1"
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="sm">
                      <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="response-deleted"
                          checked={responseFilterDeleted}
                          onCheckedChange={(checked) =>
                            setResponseFilterDeleted(checked === true)
                          }
                        />
                        <Label htmlFor="response-deleted" className="text-sm">
                          {t("Include deleted responses")}
                        </Label>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
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
                      <p className="text-sm text-muted-foreground mt-1">
                        {response.description}
                      </p>
                    )}
                  </div>
                ))}
                {responseSearchQuery &&
                  responseSearchResults.length === 0 &&
                  !isSearchingResponses && (
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

      {/* Help Button */}
      <Button
        variant="outline"
        size="icon"
        className="fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg bg-blue-600 text-white hover:bg-blue-700 hover:text-white z-50"
        onClick={() => setShowHelp(true)}
        title={t("Help & Guide")}
      >
        <HelpCircle className="h-6 w-6" />
      </Button>

      {/* Help Modal */}
      {showHelp && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          onClick={() => setShowHelp(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b p-4 flex items-center justify-between">
              <h2 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-blue-600" />
                {t("Story Guide")}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowHelp(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="p-6 space-y-6">
              <section>
                <h3 className="text-lg font-semibold mb-3 text-blue-600">
                  📌 {t("What is a Story?")}
                </h3>
                <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                  {t(
                    "A Story defines a conversation flow used by your assistant to train conversational behavior."
                  )}
                </p>
              </section>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
