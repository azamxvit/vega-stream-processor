export type StreamStatus = 'idle' | 'streaming' | 'done' | 'error';

export type StreamDoneData = {
  result: string;
};

export type StreamEvent =
  | { event: "token"; data: { delta: string } }
  | { event: "done"; data: StreamDoneData }
  | { event: "error"; data: { message: string } };
