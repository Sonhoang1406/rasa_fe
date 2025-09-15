import { MessageType, MessageVariant } from "@/lib/enum";
import { cn } from "@/lib/utils";

export const Message = ({
  type,
  variant,
}: {
  variant: MessageVariant;
  type: MessageType;
}) => {
  function getMessage() {
    switch (type) {
      case MessageType.FILE:
        return <></>;
      case MessageType.IMG:
        return <></>;
      case MessageType.PREVIEW_LINK:
        return <></>;
      case MessageType.TEXT:
        return <TextMessage variant={variant} data="test" />;
      default:
        return <></>;
    }
  }
  return getMessage();
};

// hanlde all type of message
// this is skeleton of text message handler
const TextMessage = ({
  data,
  variant,
}: {
  data: string;
  variant: MessageVariant;
}) => {
  return (
    <div
      className={cn(
        "flex",
        variant === MessageVariant.SEND ? "items-end" : "items-start"
      )}
    >
      {data}
    </div>
  );
};
