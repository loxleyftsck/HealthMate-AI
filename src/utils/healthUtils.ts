import type { HealthMetricSummary } from '../types';

/**
 * Pure helper function to calculate updated water intake metric summary.
 * Ensures consistent log format, goal checking, and max cap across all components.
 */
export function addWaterIntake(
  currentMetrics: HealthMetricSummary,
  amount: number = 250,
  maxCap: number = 5000
): { updatedMetrics: HealthMetricSummary; isGoalMetNow: boolean } {
  const currentVal = currentMetrics.waterIntake.current;
  const goalVal = currentMetrics.waterIntake.goal;

  const isGoalMetNow = currentVal < goalVal && (currentVal + amount) >= goalVal;

  const updatedMetrics: HealthMetricSummary = {
    ...currentMetrics,
    waterIntake: {
      ...currentMetrics.waterIntake,
      current: Math.min(currentVal + amount, maxCap),
      logs: [
        ...currentMetrics.waterIntake.logs,
        {
          id: Math.random().toString().slice(2, 11),
          amount,
          timestamp: new Date().toISOString(),
        },
      ],
    },
  };

  return { updatedMetrics, isGoalMetNow };
}
