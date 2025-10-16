import { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";
import { storyService } from "../api/service";
import { StoryForm } from "../components/StoryForm";
import { IStory } from "@/interfaces/story.interface";
import { toast } from "sonner";

export function EditStoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();

  // States
  const [story, setStory] = useState<IStory | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Get story from location state or fetch by ID
  const stateStory = location.state?.story as IStory | undefined;

  useEffect(() => {
    const loadStory = async () => {
      if (stateStory) {
        // Use story from navigation state
        setStory(stateStory);
        setIsLoading(false);
      } else if (id) {
        // Fetch story by ID
        try {
          setIsLoading(true);
          const response = await storyService.getStoryById(id);
          setStory(response.data);
        } catch (error) {
          console.error("Error fetching story:", error);
          setLoadError(t("Failed to load story"));
          toast.error(t("Failed to load story"));
        } finally {
          setIsLoading(false);
        }
      } else {
        setLoadError(t("Story ID not found"));
        setIsLoading(false);
      }
    };

    loadStory();
  }, [id, stateStory, t]);

  const handleSubmit = async (storyData: any) => {
    if (!story?._id) return;

    setIsSubmitting(true);
    try {
      await storyService.updateStory(story._id, storyData);
      toast.success(t("Story updated successfully"));
      navigate("/stories");
    } catch (error) {
      console.error("Error updating story:", error);
      toast.error(t("Failed to update story"));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/stories");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      </div>
    );
  }

  if (loadError || !story) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/stories")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Back")}
          </Button>
        </div>

        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">{t("Error")}</h2>
          <p className="text-muted-foreground mb-4">
            {loadError || t("Story not found")}
          </p>
          <Button onClick={() => navigate("/stories")}>{t("Back to Stories")}</Button>
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
            size="sm"
            onClick={() => navigate("/stories")}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            {t("Back")}
          </Button>
          <div>
            <h1 className="text-2xl font-bold">{t("Edit Story")}</h1>
            <p className="text-muted-foreground">{t("Edit RASA story")}: {story.name}</p>
          </div>
        </div>
      </div>

      {/* Story Form */}
      <StoryForm
        initialStory={story}
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        submitButtonText={t("Update Story")}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
