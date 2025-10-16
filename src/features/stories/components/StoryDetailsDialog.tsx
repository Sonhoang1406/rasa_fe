import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { storyService } from "../api/service";
import { IStory } from "@/interfaces/story.interface";
import { useTranslation } from "react-i18next";

interface StoryDetailsDialogProps {
  storyId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const StoryDetailsDialog: React.FC<StoryDetailsDialogProps> = ({
  storyId,
  open,
  onOpenChange,
}) => {
  const { t } = useTranslation();
  const [story, setStory] = useState<IStory | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStoryDetails = async () => {
      if (!storyId) return;

      try {
        setLoading(true);
        setError(null);
        const response = await storyService.getStoryById(storyId);
        if (response.data) {
          setStory(response.data);
        } else {
          throw new Error(t("Failed to fetch story details"));
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch story details"
        );
        console.error("Error fetching story details:", err);
      } finally {
        setLoading(false);
      }
    };

    if (open && storyId) {
      fetchStoryDetails();
    }
  }, [storyId, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{t("Story Details")}</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center p-4">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        ) : error ? (
          <div className="text-red-500 p-4">{error}</div>
        ) : story ? (
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                {t("Basic Information")}
              </h3>
              <div className="space-y-2">
                <div>
                  <span className="font-medium">{t("Name")}: </span>
                  <span>{story.name}</span>
                </div>
                <div>
                  <span className="font-medium">{t("Description")}: </span>
                  <span>{story.description || t("No description")}</span>
                </div>
                <div>
                  <span className="font-medium">{t("Created")}: </span>
                  <span>{new Date(story.createdAt).toLocaleDateString()}</span>
                </div>
                <div>
                  <span className="font-medium">{t("Last Updated")}: </span>
                  <span>{new Date(story.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                {t("YAML Definition")}
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto whitespace-pre-wrap">
                {story.define || t("No YAML definition")}
              </pre>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">
                {t("Story Components")}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">{t("Intents")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.intents && story.intents.length > 0 ? (
                      story.intents.map((intent, index) => (
                        <li key={index}>{intent}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No intents")}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("Actions")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.action && story.action.length > 0 ? (
                      story.action.map((action, index) => (
                        <li key={index}>{action}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No actions")}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("Responses")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.responses && story.responses.length > 0 ? (
                      story.responses.map((response, index) => (
                        <li key={index}>{response}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No responses")}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("Entities")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.entities && story.entities.length > 0 ? (
                      story.entities.map((entity, index) => (
                        <li key={index}>{entity}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No entities")}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("Slots")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.slots && story.slots.length > 0 ? (
                      story.slots.map((slot, index) => (
                        <li key={index}>{slot}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No slots")}</li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium mb-2">{t("Roles")}</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {story.roles && story.roles.length > 0 ? (
                      story.roles.map((role, index) => (
                        <li key={index}>{role}</li>
                      ))
                    ) : (
                      <li className="text-gray-500">{t("No roles")}</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </DialogContent>
    </Dialog>
  );
};

export default StoryDetailsDialog;
