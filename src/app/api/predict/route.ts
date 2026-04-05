import { NextResponse } from 'next/server';
import * as ort from 'onnxruntime-node';
import path from 'path';
import fs from 'fs';

export async function POST(request: Request) {
    try {
        const data = await request.json();
        
        // Use process.cwd() to locate the file in the project root
        const modelPath = path.join(process.cwd(), 'public', 'model.onnx');
        
        if (!fs.existsSync(modelPath)) {
            return NextResponse.json({ error: "Model file not found" }, { status: 500 });
        }

        // Initialize ONNX session
        const session = await ort.InferenceSession.create(modelPath);

        // 14 Features: District ID, Year, + 12 Crime Stats
        const inputValues = [
            Number(data.district_encoded || 0),
            Number(data.year || 2024),
            Number(data.murder_with_rape_gang_rape || 0),
            Number(data.dowry_deaths || 0),
            Number(data.acid_attack || 0),
            Number(data.cruelty_by_husband_or_his_relatives || 0),
            Number(data.kidnapping_and_abduction || 0),
            Number(data.rape_women_above_18 || 0),
            Number(data.rape_girls_below_18 || 0),
            Number(data.assault_on_womenabove_18 || 0),
            Number(data.assault_on_women_below_18 || 0),
            Number(data.child_rape || 0),
            Number(data.sexual_assault_of_children || 0),
            Number(data.offences_of_pocso_act || 0)
        ];

        // Create Tensor (Float32 is required by most ONNX models)
        const float32Data = Float32Array.from(inputValues);
        const tensor = new ort.Tensor('float32', float32Data, [1, 14]);

        // 'float_input' must match the name used in your Python convert.py
        const feeds = { float_input: tensor };
        
        const results = await session.run(feeds);
        
        /**
         * After disabling zipmap in Python, results.label.data[0] 
         * will contain your prediction (Low, Medium, High, Critical).
         */
        let prediction = results.label.data[0];

        // Handle BigInt conversion if the model returns integer indices instead of strings
        if (typeof prediction === 'bigint') {
            prediction = Number(prediction);
        }

        return NextResponse.json({ 
            success: true, 
            threat_level: prediction 
        });

    } catch (error: any) {
        console.error("Inference Error:", error);
        return NextResponse.json({ 
            success: false, 
            error: error.message 
        }, { status: 500 });
    }
}