import { CHART_DATA } from "../constants/chart-data";
import type { TopLevelSpec } from 'vega-lite';

/**
 * Описываем структуру, которую мы реально ожидаем от JSON в маркдауне.
 * Это "сырые" данные до того, как мы добавим туда константы.
 */
interface RawVegaSpec {
  mark: string | object;
  encoding: Record<string, unknown>;
  [key: string]: unknown; // Позволяем другие поля, но не any
}

export const extractAndValidateVega = (text: string): TopLevelSpec | null => {
  const match = text.match(/```json\n([\s\S]*?)(?:```|$)/);
  if (!match) return null;

  try {
    const rawSpec = JSON.parse(match[1].trim()) as RawVegaSpec;
    
    // Валидация
    if (rawSpec && typeof rawSpec === 'object' && rawSpec.mark && rawSpec.encoding) {
      // Собираем объект, строго соответствующий TopLevelSpec
      const spec: TopLevelSpec = {
        ...rawSpec,
        data: { values: CHART_DATA },
        width: "container",
        height: 250,
        autosize: { type: "fit", contains: "padding" }
      } as TopLevelSpec; // Безопасное приведение к финальному интерфейсу библиотеки

      return spec;
    }
  } catch {
    return null;
  }
  
  return null;
};