/* eslint-disable @typescript-eslint/no-explicit-any */
import styles from "./messageBubble.module.scss";
import Image from "next/image";
import botIcon from "../../../../public/icons/bot-response-icon.svg";
import {
  BarChartComponent,
  ComparisonBarChart,
  DataTable,
  PieChartComponent,
  ProgressChart,
} from "../chart-components";
import {
  Message,
  UserMessage,
  BotMessage,
  isProgressVisualization,
  isBarVisualization,
  isPieVisualization,
  isTableVisualization,
  Visualization,
} from "@/lib/types/agentResponse";

interface MessageBubbleProps {
  message: Message;
}

export function MessageBubble({ message }: MessageBubbleProps) {
  // User message
  if (message.isUser) {
    return (
      <main className={styles["user_message_main_div"]}>
        <div className={styles["user_message_content_div"]}>
          <p>{(message as UserMessage).content}</p>
        </div>
      </main>
    );
  }

  // Bot message
  const botMessage = message as BotMessage;
  const { agentResponse } = botMessage;

  return (
    <main className={styles["bot_message_main_div"]}>
      <div className={styles["bot_message_container"]}>
        <Image src={botIcon} width={32} height={32} alt="bot_icon_response" />

        {/* Main Response Text */}
        <div className={styles["bot_text_message"]}>
          <p className="mb-4">{agentResponse.response}</p>
        
          {/* Visualizations */}
          {agentResponse.data?.visualizations && 
           agentResponse.data.visualizations.length > 0 && (
            <div className="mt-4 space-y-2 w-full">
              {agentResponse.data.visualizations.map((viz, index) => (
                <VisualizationRenderer key={index} visualization={viz} />
              ))}
            </div>
          )}

          {/* Recommendations */}
          {agentResponse.data?.recommendations && 
           agentResponse.data.recommendations.length > 0 && (
            <div className="mt-4">
              <h2 className="font-semibold mb-2">Recommendations:</h2>
              <ul className="list-disc list-inside space-y-1 ml-2">
                {agentResponse.data.recommendations.map((rec, index) => (
                  <li key={index} className="text-xs">{rec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Question */}
          {agentResponse.data?.next_question && (
            <div className="mt-4">
              <h1 className="font-semibold mb-2 text-grey-500 text-sm">Next Question:</h1>
            <p className="mt-4 font-semibold text-grey-500">
              {agentResponse.data.next_question}
            </p>
            </div>
          )}
        </div>

      </div>
    </main>
  );
}

// Component to render different visualization types
function VisualizationRenderer({ visualization }: { visualization: Visualization }) {
  if (isProgressVisualization(visualization)) {
    return (
      <ProgressChart
        data={visualization.data.goals}
        title={visualization.title}
      />
    );
  }

  if (isBarVisualization(visualization)) {
  // Check if we have multiple datasets (comparison mode)
  if (visualization.data.datasets.length > 1) {
    // Transform for grouped bar chart
    const comparisonData = visualization.data.x_axis.values.map((label, index) => {
      const dataPoint: any = { name: label };
      
      // Add each dataset as a separate key
      visualization.data.datasets.forEach((dataset) => {
        dataPoint[dataset.label] = dataset.data[index];
      });
      
      return dataPoint;
    });

    return (
      <ComparisonBarChart
        data={comparisonData}
        datasets={visualization.data.datasets}
        title={visualization.title}
        xAxisLabel={visualization.data.x_axis.label}
        yAxisLabel={visualization.data.y_axis.label}
      />
    );
  } else {
    // Single dataset - existing code
    const barData = visualization.data.x_axis.values.map((label, index) => ({
      name: label,
      value: visualization.data.datasets[0].data[index],
    }));

    return (
      <BarChartComponent
        data={barData}
        dataset={visualization.data.datasets}
        title={visualization.title}
        xAxisLabel={visualization.data.x_axis.label}
        yAxisLabel={visualization.data.y_axis.label}
      />
    );
  }
}

  if (isPieVisualization(visualization)) {
    // Transform pie visualization data to component format
    const pieData = visualization.data.labels.map((label, index) => ({
      name: label,
      value: visualization.data.values[index],
      color: visualization.data.colors[index],
    }));

    return (
      <PieChartComponent
        data={pieData}
        title={visualization.title}
      />
    );
  }

  if (isTableVisualization(visualization)) {
    const tableData = {columns: visualization.data.columns, rows: visualization.data.rows};
    return (
      <DataTable 
        data={tableData} 
        title={visualization.title} 
      />
    );
  }
  return null;
}