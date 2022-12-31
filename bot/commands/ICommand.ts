import { TurnContext } from "botbuilder";

export interface ICommand {
    checkCommand: (message: string, context: TurnContext) => boolean;
    processCommand: (context: TurnContext, message: string, fromId: string, conversationId: string) => Promise<void>;
}