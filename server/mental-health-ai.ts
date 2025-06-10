import { LLMProviderManager } from "./llm-providers";

export interface SOAPFormat {
  subjective: string;
  objective: string;
  assessment: string;
  plan: string;
}

export interface ProcessedNotes {
  soapFormat: SOAPFormat;
  keyInsights: string[];
  riskFactors: string[];
  progressNotes: string;
  nextSessionGoals: string[];
}

export interface CMS1500Data {
  patientInfo: {
    lastName: string;
    firstName: string;
    dateOfBirth: string;
    gender: string;
    address: string;
    phone: string;
  };
  insuranceInfo: {
    primaryPayer: string;
    policyNumber: string;
    groupNumber?: string;
    subscriberId: string;
  };
  providerInfo: {
    npi: string;
    taxonomyCode: string;
    name: string;
    address: string;
    phone: string;
  };
  serviceInfo: {
    dateOfService: string;
    placeOfService: string;
    cptCode: string;
    icdCode: string;
    chargeAmount: string;
    units: string;
  };
}

export interface ClaimRejectionAnalysis {
  rejectionCode: string;
  rejectionReason: string;
  aiSuggestedFix: string;
  resubmissionPlan: string[];
  riskScore: number;
}

export class MentalHealthAI {
  private llmManager: LLMProviderManager;
  private defaultProvider: string;
  private defaultModel: string;

  constructor(providerType: string = "google", model: string = "gemini-pro") {
    this.llmManager = new LLMProviderManager();
    this.defaultProvider = providerType;
    this.defaultModel = model;
  }

  async processTherapyNotes(rawNotes: string, sessionType: string = "individual"): Promise<ProcessedNotes> {
    try {
      const prompt = `You are a licensed mental health professional's BotSmith assistant. Process these therapy session notes into a professional SOAP format and extract key clinical insights.

Session Type: ${sessionType}
Raw Notes: ${rawNotes}

Please provide a JSON response with:
1. SOAP format (Subjective, Objective, Assessment, Plan)
2. Key insights from the session
3. Any risk factors identified
4. Progress notes
5. Goals for next session

Ensure all content maintains HIPAA compliance and professional clinical standards.`;

      const response = await this.llmManager.generateResponse(
        [{ id: '1', type: 'user', content: prompt, timestamp: new Date().toISOString() }],
        this.defaultProvider,
        this.defaultModel
      );

      // Parse the AI response to extract structured data
      return this.parseNotesResponse(response);
    } catch (error) {
      console.error("Therapy notes processing error:", error);
      throw new Error("Failed to process therapy notes");
    }
  }

  async generateCMS1500(sessionData: any, clientData: any, providerData: any): Promise<CMS1500Data> {
    try {
      const prompt = `Generate a CMS-1500 form data structure for this mental health session:

Session Data: ${JSON.stringify(sessionData)}
Client Data: ${JSON.stringify(clientData)}
Provider Data: ${JSON.stringify(providerData)}

Please provide properly formatted CMS-1500 data following current healthcare billing standards.`;

      const response = await this.llmManager.generateResponse(
        [{ id: '1', type: 'user', content: prompt, timestamp: new Date().toISOString() }],
        this.defaultProvider,
        this.defaultModel
      );

      return this.parseCMS1500Response(response);
    } catch (error) {
      console.error("CMS-1500 generation error:", error);
      throw new Error("Failed to generate CMS-1500 form");
    }
  }

  async analyzeClaimRejection(rejectionCode: string, rejectionReason: string, originalClaim: any): Promise<ClaimRejectionAnalysis> {
    try {
      const prompt = `Analyze this insurance claim rejection and provide actionable solutions:

Rejection Code: ${rejectionCode}
Rejection Reason: ${rejectionReason}
Original Claim Data: ${JSON.stringify(originalClaim)}

Provide:
1. Clear explanation of the rejection
2. Specific steps to fix the issue
3. Resubmission plan
4. Risk assessment for future claims
5. Recommendations to prevent similar rejections`;

      const response = await this.llmManager.generateResponse(
        [{ id: '1', type: 'user', content: prompt, timestamp: new Date().toISOString() }],
        this.defaultProvider,
        this.defaultModel
      );

      return this.parseRejectionAnalysis(response, rejectionCode, rejectionReason);
    } catch (error) {
      console.error("Claim rejection analysis error:", error);
      throw new Error("Failed to analyze claim rejection");
    }
  }

  async validateClaim(claimData: CMS1500Data): Promise<{
    isValid: boolean;
    issues: string[];
    recommendations: string[];
    riskScore: number;
  }> {
    try {
      const prompt = `Validate this CMS-1500 claim for potential issues before submission:

Claim Data: ${JSON.stringify(claimData)}

Check for:
1. Required field completeness
2. Code compatibility (CPT and ICD-10)
3. Common rejection risks
4. Billing best practices
5. Payer-specific requirements

Provide validation results with risk assessment.`;

      const response = await this.llmManager.generateResponse(
        [{ id: '1', type: 'user', content: prompt, timestamp: new Date().toISOString() }],
        this.defaultProvider,
        this.defaultModel
      );

      return this.parseValidationResponse(response);
    } catch (error) {
      console.error("Claim validation error:", error);
      return {
        isValid: false,
        issues: ["Validation service temporarily unavailable"],
        recommendations: ["Manual review recommended"],
        riskScore: 50
      };
    }
  }

  private parseNotesResponse(content: string): ProcessedNotes {
    try {
      // Try to extract JSON from the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          soapFormat: parsed.soapFormat || this.extractSOAPFromText(content),
          keyInsights: parsed.keyInsights || [],
          riskFactors: parsed.riskFactors || [],
          progressNotes: parsed.progressNotes || "",
          nextSessionGoals: parsed.nextSessionGoals || []
        };
      }
    } catch (error) {
      console.log("Parsing as structured text instead");
    }

    // Fallback to text parsing
    return {
      soapFormat: this.extractSOAPFromText(content),
      keyInsights: this.extractSection(content, "key insights", "insights"),
      riskFactors: this.extractSection(content, "risk factors", "risks"),
      progressNotes: this.extractSection(content, "progress", "progress notes"),
      nextSessionGoals: this.extractSection(content, "goals", "next session")
    };
  }

  private extractSOAPFromText(content: string): SOAPFormat {
    return {
      subjective: this.extractSection(content, "subjective", "s:").join(" ") || "Client reported information from session",
      objective: this.extractSection(content, "objective", "o:").join(" ") || "Observable behaviors and presentations noted",
      assessment: this.extractSection(content, "assessment", "a:").join(" ") || "Clinical assessment and diagnostic impressions",
      plan: this.extractSection(content, "plan", "p:").join(" ") || "Treatment plan and next steps"
    };
  }

  private extractSection(content: string, ...keywords: string[]): string[] {
    const lines = content.split('\n');
    const results: string[] = [];
    
    for (const keyword of keywords) {
      for (let i = 0; i < lines.length; i++) {
        if (lines[i].toLowerCase().includes(keyword.toLowerCase())) {
          // Extract content after this line
          for (let j = i + 1; j < lines.length && j < i + 5; j++) {
            if (lines[j].trim()) {
              results.push(lines[j].trim());
            }
          }
          break;
        }
      }
    }
    
    return results;
  }

  private parseCMS1500Response(content: string): CMS1500Data {
    // Parse AI response into CMS1500 structure
    // This would be implemented based on the AI response format
    return {
      patientInfo: {
        lastName: "",
        firstName: "",
        dateOfBirth: "",
        gender: "",
        address: "",
        phone: ""
      },
      insuranceInfo: {
        primaryPayer: "",
        policyNumber: "",
        subscriberId: ""
      },
      providerInfo: {
        npi: "",
        taxonomyCode: "",
        name: "",
        address: "",
        phone: ""
      },
      serviceInfo: {
        dateOfService: "",
        placeOfService: "11", // Office
        cptCode: "",
        icdCode: "",
        chargeAmount: "",
        units: "1"
      }
    };
  }

  private parseRejectionAnalysis(content: string, code: string, reason: string): ClaimRejectionAnalysis {
    return {
      rejectionCode: code,
      rejectionReason: reason,
      aiSuggestedFix: content,
      resubmissionPlan: this.extractSection(content, "resubmission", "steps", "plan"),
      riskScore: this.extractRiskScore(content)
    };
  }

  private parseValidationResponse(content: string): {
    isValid: boolean;
    issues: string[];
    recommendations: string[];
    riskScore: number;
  } {
    return {
      isValid: !content.toLowerCase().includes("issue") && !content.toLowerCase().includes("error"),
      issues: this.extractSection(content, "issues", "problems", "errors"),
      recommendations: this.extractSection(content, "recommendations", "suggestions"),
      riskScore: this.extractRiskScore(content)
    };
  }

  private extractRiskScore(content: string): number {
    const riskMatch = content.match(/risk.*?(\d+)/i);
    return riskMatch ? parseInt(riskMatch[1]) : 50;
  }
}