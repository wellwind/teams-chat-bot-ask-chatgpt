import { TeamsActivityHandler, TurnContext } from "botbuilder";
import { askAiCommand } from "./commands/askAiCommand";
import { createImageCommand } from "./commands/createImageCommand";
import { deleteApiKeyCommand } from "./commands/deleteApiKeyCommand";
import { forgetConversationCommand } from "./commands/forgetConversationCommand";
import { helpCommand } from "./commands/helpCommand";
import { setApiKeyCommand } from "./commands/setApiKeyCommand";
import { writeCodeCommand } from "./commands/writeCodeCommand";

export class TeamsBot extends TeamsActivityHandler {
  constructor() {
    super();

    this.onMessage(async (context, next) => {
      console.log(`Running with Message Activity`);

      const fromId = context.activity.from.id;
      const conversationId = context.activity.conversation.id;
      const message = TurnContext.removeRecipientMention(
        context.activity
      ).trim();

      console.log(`messasge: ${message}`);
      const commands = [
        helpCommand,
        setApiKeyCommand,
        deleteApiKeyCommand,
        forgetConversationCommand,
        writeCodeCommand,
        createImageCommand,
        askAiCommand,
      ];

      for (let command of commands) {
        if (command.checkCommand(message, context)) {
          await context.sendActivity({ type: "typing" });

          await command.processCommand(
            context,
            message,
            fromId,
            conversationId
          );
          break;
        }
      }

      // By calling next() you ensure that the next BotHandler is run.
      await next();
    });
  }
}
