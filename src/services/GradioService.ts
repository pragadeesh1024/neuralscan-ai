import { Client } from "@gradio/client";

export interface PredictionResult {
  hasTumor: boolean;
  type: string;
  confidence: number;
  rawText: string;
  timestamp: string;
  isSimulated?: boolean;
}

export class GradioService {
  private static SPACE_NAME = "pragadeesh10/brain12";
  private static client: any = null;
  private static isConnected = false;

  static getIsConnected() {
    return this.isConnected;
  }

  // Attempt to connect to the Hugging Face space
  static async connect(): Promise<boolean> {
    if (this.client && this.isConnected) return true;
    try {
      // Connect to gradio with a 10s timeout
      const connectPromise = Client.connect(this.SPACE_NAME);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Connection timeout")), 12000)
      );

      this.client = await Promise.race([connectPromise, timeoutPromise]);
      this.isConnected = true;
      console.log("Connected to Gradio space successfully.");
      return true;
    } catch (error) {
      this.isConnected = false;
      this.client = null;
      console.warn("Failed to connect to Hugging Face Gradio Space. Using simulation mode fallback.", error);
      throw error;
    }
  }

  // Perform prediction on the image blob
  static async predict(imageBlob: Blob, useSimulation = false): Promise<PredictionResult> {
    const timestamp = new Date().toLocaleTimeString();

    if (useSimulation) {
      return this.simulatePrediction(imageBlob, timestamp);
    }

    try {
      await this.connect();
      
      const predictPromise = this.client.predict("/predict_tumor", {
        img: imageBlob,
      });

      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Prediction timeout")), 15000)
      );

      const result: any = await Promise.race([predictPromise, timeoutPromise]);
      const rawText = result.data[0] as string;
      
      return {
        ...this.parsePredictionText(rawText),
        timestamp,
        isSimulated: false
      };
    } catch (error) {
      console.error("Gradio prediction failed:", error);
      throw error;
    }
  }

  // Parse the markdown text returned by pragadeesh10/brain12
  static parsePredictionText(text: string): Omit<PredictionResult, 'timestamp'> {
    if (!text) {
      return {
        hasTumor: false,
        type: "Unknown",
        confidence: 0,
        rawText: ""
      };
    }

    const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
    const hasTumor = text.includes("Tumor Detected") && !text.includes("No Tumor Detected");
    
    let type = "Unknown";
    let confidence = 0;

    for (const line of lines) {
      if (line.startsWith("Type:")) {
        type = line.replace("Type:", "").trim();
      } else if (line.startsWith("Confidence:")) {
        const match = line.match(/Confidence:\s*([\d.]+)/);
        if (match) {
          confidence = parseFloat(match[1]);
        }
      }
    }

    // Backup parser: if format is different
    if (type === "Unknown") {
      const typeLine = lines.find(l => l.toLowerCase().includes("type:"));
      if (typeLine) {
        type = typeLine.split(":")[1]?.trim() || "Unknown";
      }
    }

    return {
      hasTumor,
      type,
      confidence,
      rawText: text
    };
  }

  // Local simulation engine based on the model's actual output format
  private static simulatePrediction(imageBlob: Blob, timestamp: string): PredictionResult {
    // We can simulate based on some characteristic of the blob (e.g. its size)
    // to keep it deterministic or semi-random.
    const size = imageBlob.size;
    const isNormal = size % 2 === 0; // Simulate normal vs tumor
    
    // Choose a label from the list of actual labels from class_labels.txt
    let label = "";
    let confidence = 75 + Math.random() * 24.5; // High confidence like real models

    if (isNormal) {
      label = Math.random() > 0.5 ? "_NORMAL T1" : "_NORMAL T2";
    } else {
      const tumorLabels = [
        "Glioblastoma T1C+", "Meningioma T2", "Astrocitoma T2", "Schwannoma T1C+",
        "Oligodendroglioma T2", "Ependimoma T1C+", "Carcinoma T2", "Tuberculoma T1C+"
      ];
      label = tumorLabels[size % tumorLabels.length];
    }

    const rawText = isNormal 
      ? `✅ No Tumor Detected\n\nType: ${label}\nConfidence: ${confidence.toFixed(2)}%`
      : `⚠️ Tumor Detected\n\nType: ${label}\nConfidence: ${confidence.toFixed(2)}%`;

    return {
      hasTumor: !isNormal,
      type: label,
      confidence: parseFloat(confidence.toFixed(2)),
      rawText,
      timestamp,
      isSimulated: true
    };
  }
}
