import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, Activity, Send, Play, Upload, CheckCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { chatBotService } from "../api/service";
import { 
  ChatBot, 
  ActionsListResponse, 
  HealthCheckResponse,
  ModelDetail 
} from "../api/dto/ChatBotResponse";

interface ChatBotOperationsDialogProps {
  chatBot: ChatBot | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatBotOperationsDialog({
  chatBot,
  open,
  onOpenChange,
}: ChatBotOperationsDialogProps) {
  const { t } = useTranslation();
  
  // Health Check
  const [healthStatus, setHealthStatus] = useState<HealthCheckResponse | null>(null);
  const [healthLoading, setHealthLoading] = useState(false);

  // Models List
  const [modelsList, setModelsList] = useState<string[]>([]);
  const [modelsDetails, setModelsDetails] = useState<ModelDetail[]>([]);
  const [modelsLoading, setModelsLoading] = useState(false);

  // Actions List
  const [actionsList, setActionsList] = useState<ActionsListResponse["actions"]>([]);
  const [actionsLoading, setActionsLoading] = useState(false);

  // Send Model
  const [selectedModelId, setSelectedModelId] = useState("");
  const [sendModelLoading, setSendModelLoading] = useState(false);

  // Run Model
  const [selectedModelName, setSelectedModelName] = useState("");
  const [runModelLoading, setRunModelLoading] = useState(false);

  // Push Action
  const [pushActionModelId, setPushActionModelId] = useState("");
  const [selectedActionIds, setSelectedActionIds] = useState<string[]>([]);
  const [pushActionLoading, setPushActionLoading] = useState(false);

  const handleHealthCheck = async () => {
    if (!chatBot) return;
    setHealthLoading(true);
    try {
      const result = await chatBotService.healthCheck(chatBot._id);
      setHealthStatus(result);

      const services = Object.entries(result.data);
      const offlineServices = services.filter(([_, service]) => 
        service.status === "offline" || service.status === "not_responding"
      );
      
      if (offlineServices.length > 0) {
        toast.warning(`${offlineServices.length} ${t("service(s) offline")}`);
      } else {
        toast.success(t("All services are online"));
      }
    } catch (error) {
      console.error("Health check error:", error);
      toast.error(t("Failed to check health"));
    } finally {
      setHealthLoading(false);
    }
  };

  const handleGetModelsList = async () => {
    if (!chatBot) return;
    setModelsLoading(true);
    try {
      const result = await chatBotService.getModelsList(chatBot._id);
      setModelsList(result.models || []);
      setModelsDetails(result.details || []);
      toast.success(`${t("Found")} ${result.total} ${t("models")}`);
    } catch (error) {
      console.error("Get models error:", error);
      toast.error(t("Failed to fetch models"));
    } finally {
      setModelsLoading(false);
    }
  };

  const handleGetActionsList = async () => {
    if (!chatBot) return;
    setActionsLoading(true);
    try {
      const result = await chatBotService.getActionsList(chatBot._id);
      setActionsList(result.actions || []);
      toast.success(`${t("Found")} ${result.total} ${t("actions")}`);
    } catch (error) {
      console.error("Get actions error:", error);
      toast.error(t("Failed to fetch actions"));
    } finally {
      setActionsLoading(false);
    }
  };

  const handleSendModel = async () => {
    if (!chatBot || !selectedModelId) return;
    setSendModelLoading(true);
    try {
      await chatBotService.sendModel(chatBot._id, { modelId: selectedModelId });
      toast.success(t("Model sent successfully"));
      setSelectedModelId("");
    } catch (error) {
      console.error("Send model error:", error);
      toast.error(t("Failed to send model"));
    } finally {
      setSendModelLoading(false);
    }
  };

  const handleRunModel = async () => {
    if (!chatBot || !selectedModelName) return;
    setRunModelLoading(true);
    try {
      await chatBotService.runModel(chatBot._id, { modelName: selectedModelName });
      toast.success(t("Model started successfully"));
      setSelectedModelName("");
    } catch (error) {
      console.error("Run model error:", error);
      toast.error(t("Failed to run model"));
    } finally {
      setRunModelLoading(false);
    }
  };

  const handlePushAction = async () => {
    if (!chatBot) return;
    setPushActionLoading(true);
    try {
      await chatBotService.pushAction(chatBot._id, {
        modelId: pushActionModelId || undefined,
        actionIds: selectedActionIds.length > 0 ? selectedActionIds : undefined,
      });
      
      toast.success(t("Actions pushed successfully"));
      setPushActionModelId("");
      setSelectedActionIds([]);
    } catch (error) {
      console.error("Push actions error:", error);
      toast.error(t("Failed to push actions"));
    } finally {
      setPushActionLoading(false);
    }
  };

  const toggleActionSelection = (actionId: string) => {
    setSelectedActionIds(prev => 
      prev.includes(actionId)
        ? prev.filter(id => id !== actionId)
        : [...prev, actionId]
    );
  };

  const toggleAllActions = () => {
    if (selectedActionIds.length === actionsList.length) {
      setSelectedActionIds([]);
    } else {
      setSelectedActionIds(actionsList.map(a => a._id));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[90vw] sm:max-w-3xl h-[700px] flex flex-col">
        <DialogHeader>
          <DialogTitle>{t("ChatBot Operations")}</DialogTitle>
          <DialogDescription>
            {t("Manage operations for")} {chatBot?.name}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="health" className="w-full flex-1 flex flex-col overflow-hidden">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="health">{t("Health")}</TabsTrigger>
            <TabsTrigger value="models">{t("Models")}</TabsTrigger>
            <TabsTrigger value="actions">{t("Actions")}</TabsTrigger>
          </TabsList>

          {/* Health Check Tab */}
          <TabsContent value="health" className="flex-1 overflow-y-auto mt-4 space-y-4">
            <Button
              onClick={handleHealthCheck}
              disabled={healthLoading}
              className="w-full"
            >
              {healthLoading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Activity className="mr-2 h-4 w-4" />
              )}
              {t("Check Health")}
            </Button>

            {healthStatus && (
              <div className="space-y-3">
                {/* Overall Message */}
                {healthStatus.message && (
                  <div className="p-3 bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg">
                    <div className="flex items-center text-blue-700 dark:text-blue-300">
                      <Activity className="h-4 w-4 mr-2" />
                      <span className="font-medium">{healthStatus.message}</span>
                    </div>
                  </div>
                )}

                {/* Services Status */}
                <div className="space-y-2">
                  <h4 className="font-semibold text-sm text-gray-700 dark:text-gray-300">
                    {t("Services Status")}:
                  </h4>
                  
                  {Object.entries(healthStatus.data).map(([serviceName, serviceData]) => {

                    const isOnline = serviceData.status === "running";
                    const isWarning = serviceData.status === "not_responding";
                    
                    return (
                      <div
                        key={serviceName}
                        className={`p-4 rounded-lg border-2 ${
                          isOnline
                            ? "bg-green-50 dark:bg-green-950 border-green-300 dark:border-green-700"
                            : isWarning
                            ? "bg-yellow-50 dark:bg-yellow-950 border-yellow-300 dark:border-yellow-700"
                            : "bg-red-50 dark:bg-red-950 border-red-300 dark:border-red-700"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              {isOnline ? (
                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400 mr-2" />
                              ) : (
                                <AlertCircle className={`h-4 w-4 mr-2 ${
                                  isWarning 
                                    ? "text-yellow-600 dark:text-yellow-400" 
                                    : "text-red-600 dark:text-red-400"
                                }`} />
                              )}
                              <h5 className="font-semibold text-sm">{serviceName}</h5>
                            </div>
                            
                            <Badge
                              variant={isOnline ? "default" : "destructive"}
                              className={isWarning ? "bg-yellow-500 hover:bg-yellow-600" : ""}
                            >
                              {serviceData.status.toUpperCase()}
                            </Badge>

                            {serviceData.error && (
                              <div className="mt-2 p-2 bg-white dark:bg-gray-900 rounded border border-red-200 dark:border-red-800">
                                <p className="text-xs font-medium text-red-700 dark:text-red-300 mb-1">
                                  {t("Error Details")}:
                                </p>
                                <p className="text-xs text-red-600 dark:text-red-400 font-mono break-all">
                                  {serviceData.error}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {!healthStatus && !healthLoading && (
              <div className="text-center py-8 text-gray-500">
                <Activity className="h-12 w-12 mx-auto mb-2 text-gray-400" />
                <p>{t("Click button above to check health status")}</p>
              </div>
            )}
          </TabsContent>

          {/* Models Tab */}
          <TabsContent value="models" className="flex-1 overflow-y-auto mt-4">
            <div className="space-y-4 h-full">
              {/* Get Models List */}
              <div className="space-y-2">
                <Button
                  onClick={handleGetModelsList}
                  disabled={modelsLoading}
                  className="w-full"
                >
                  {modelsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("Get Models List")}
                </Button>

                {modelsList.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg max-h-40 overflow-y-auto">
                    <h4 className="font-semibold mb-2">{t("Available Models")}:</h4>
                    <div className="space-y-1">
                      {modelsList.map((model, index) => (
                        <div key={index} className="text-sm">• {model}</div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                {/* Send Model */}
                <div className="space-y-2">
                  <Label htmlFor="modelId">{t("Send Model")}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedModelId}
                      onValueChange={setSelectedModelId}
                      disabled={modelsDetails.length === 0}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={
                          modelsDetails.length === 0 
                            ? t("Get models list first") 
                            : t("Select model to send")
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {modelsDetails.map((model) => (
                          <SelectItem key={model._id} value={model._id}>
                            <div className="flex flex-col">
                              <span className="font-medium">{model.name}</span>
                              {model.description && (
                                <span className="text-xs text-muted-foreground">
                                  {model.description}
                                </span>
                              )}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleSendModel}
                      disabled={sendModelLoading || !selectedModelId}
                    >
                      {sendModelLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Run Model */}
                <div className="space-y-2">
                  <Label htmlFor="modelName">{t("Run Model")}</Label>
                  <div className="flex gap-2">
                    <Select
                      value={selectedModelName}
                      onValueChange={setSelectedModelName}
                      disabled={modelsList.length === 0}
                    >
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder={
                          modelsList.length === 0 
                            ? t("Get models list first") 
                            : t("Select model to run")
                        } />
                      </SelectTrigger>
                      <SelectContent>
                        {modelsList.map((model, index) => (
                          <SelectItem key={index} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Button
                      onClick={handleRunModel}
                      disabled={runModelLoading || !selectedModelName}
                    >
                      {runModelLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Actions Tab */}
          <TabsContent value="actions" className="flex-1 overflow-y-auto mt-4">
            <div className="space-y-4 h-full">
              {/* Get Actions List */}
              <div className="space-y-2">
                <Button
                  onClick={handleGetActionsList}
                  disabled={actionsLoading}
                  className="w-full"
                >
                  {actionsLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}
                  {t("Get Actions List")}
                </Button>

                {actionsList.length > 0 && (
                  <div className="p-4 bg-muted rounded-lg max-h-48 overflow-y-auto">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold">{t("Available Actions")}:</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleAllActions}
                      >
                        {selectedActionIds.length === actionsList.length
                          ? t("Deselect All")
                          : t("Select All")}
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {actionsList.map((action) => (
                        <div 
                          key={action._id} 
                          className="flex items-start space-x-2 border-b pb-2"
                        >
                          <Checkbox
                            id={`action-${action._id}`}
                            checked={selectedActionIds.includes(action._id)}
                            onCheckedChange={() => toggleActionSelection(action._id)}
                            className="mt-1"
                          />
                          <label
                            htmlFor={`action-${action._id}`}
                            className="flex-1 cursor-pointer"
                          >
                            <div className="font-medium text-sm">{action.name}</div>
                            {action.description && (
                              <div className="text-muted-foreground text-xs">
                                {action.description}
                              </div>
                            )}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="border-t pt-4 space-y-4">
                {/* Push Actions */}
                <div className="space-y-2">
                  <Label>{t("Push Actions")}</Label>
                  
                  <Select
                    value={pushActionModelId}
                    onValueChange={setPushActionModelId}
                    disabled={modelsDetails.length === 0}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={
                        modelsDetails.length === 0
                          ? t("Model ID (optional)")
                          : t("Select model (optional)")
                      } />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">{t("None - Push all")}</SelectItem>
                      {modelsDetails.map((model) => (
                        <SelectItem key={model._id} value={model._id}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  {selectedActionIds.length > 0 && (
                    <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded text-sm">
                      <strong>{t("Selected")}:</strong> {selectedActionIds.length} {t("actions")}
                    </div>
                  )}

                  <Button
                    onClick={handlePushAction}
                    disabled={pushActionLoading || actionsList.length === 0}
                    className="w-full"
                  >
                    {pushActionLoading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Upload className="mr-2 h-4 w-4" />
                    )}
                    {t("Push Actions")}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}