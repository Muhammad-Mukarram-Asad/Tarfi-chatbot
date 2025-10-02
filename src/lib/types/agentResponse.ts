// types/agentResponses.ts

// Base visualization types
export interface ProgressGoal {
  label: string;
  current: number;
  target: number;
  percentage: number;
  color: string;
}

export interface ProgressVisualization {
  id: string;
  type: "progress";
  title: string;
  data: {
    goals: ProgressGoal[];
  };
  config: {
    responsive: boolean;
    show_percentages: boolean;
    show_values: boolean;
  };
}

export interface BarVisualization {
  id: string;
  type: "bar";
  title: string;
  data: {
    x_axis: {
      label: string;
      values: string[];
    };
    y_axis: {
      label: string;
      min: number;
      max: number;
      step: number;
    };
    datasets: Array<{
      label: string;
      data: number[];
      color: string | string[];
    }>;
  };
  config: {
    responsive: boolean;
    show_legend: boolean;
    orientation?: string;
  };
}

export interface PieVisualization {
  id: string;
  type: "pie";
  title: string;
  data: {
    labels: string[];
    values: number[];
    colors: string[];
  };
  config: {
    responsive: boolean;
    show_legend: boolean;
  };
}

export type Visualization = ProgressVisualization | BarVisualization | PieVisualization;

// Agent response data structure
export interface AgentResponseData {
  visualizations?: Visualization[];
  recommendations?: string[];
  next_question?: string;
}

// Main agent response interface
export interface AgentResponse {
  response: string;
  timestamp: string;
  data?: AgentResponseData;
}

// Message types for the chat
export interface BaseMessage {
  isUser: boolean;
  color: string;
  bgcolor: string;
}

export interface UserMessage extends BaseMessage {
  type: "text";
  content: string;
  isUser: true;
}

export interface BotMessage extends BaseMessage {
  type: "general" | "goal" | "budget" | "debt" | "retirement";
  isUser: false;
  agentResponse: AgentResponse;
}

export type Message = UserMessage | BotMessage;

// Utility function to parse agent response
export function parseAgentResponse(rawResponse: string): AgentResponse {
  try {
    return JSON.parse(rawResponse);
  } catch (error) {
    console.error("Failed to parse agent response:", error);
    return {
      response: "Error parsing response",
      timestamp: new Date().toISOString(),
      data: {
        next_question: "Please try again."
      }
    };
  }
}

// Type guards
export function isProgressVisualization(viz: Visualization): viz is ProgressVisualization {
  return viz.type === "progress";
}

export function isBarVisualization(viz: Visualization): viz is BarVisualization {
  return viz.type === "bar";
}

export function isPieVisualization(viz: Visualization): viz is PieVisualization {
  return viz.type === "pie";
}