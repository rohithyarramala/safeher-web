import { NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node';

export async function POST(req: Request) {
  const { latitude, longitude } = await req.json();
  
  // Load ONNX model (place file in /public/model/danger_model.onnx)
  const session = await ort.InferenceSession.create('./public/model/danger_model.onnx');
  const input = new ort.Tensor('float32', [latitude, longitude], [1, 2]);
  const outputs = await session.run({ input_name: input });
  
  const threatLevels = ["Low", "Medium", "High", "Critical"];
  const prediction = Number(outputs.output_name.data[0]);

  return NextResponse.json({ threat_level: threatLevels[prediction] });
}