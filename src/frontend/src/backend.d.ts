import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface SIPSession {
    id: bigint;
    recommendations: Array<FundRecommendation>;
    riskProfile: RiskProfile;
    projection: SIPProjection;
    submission: SIPSubmission;
}
export interface RiskProfile {
    profileType: string;
    riskScore: bigint;
}
export interface SIPSubmission {
    goalAmount: bigint;
    yearlyInvestmentAmount: bigint;
    monthlyAmount: bigint;
    existingCorpus: bigint;
    tenureYears: bigint;
    investorName: string;
}
export interface FundRecommendation {
    cagr: bigint;
    sharpeRatio: bigint;
    fundName: string;
    category: string;
    riskLevel: string;
    riskScore: bigint;
}
export interface SIPProjection {
    totalInvested: bigint;
    wealthGain: bigint;
    projectedReturnRate: bigint;
    projectedCorpus: bigint;
}
export interface backendInterface {
    calculateSIPProjection(_name: string, monthlyAmount: bigint, tenureYears: bigint, expectedReturnRate: bigint): Promise<SIPProjection>;
    getFundRecommendations(profileType: string): Promise<Array<FundRecommendation>>;
    getRegisteredEmailCount(): Promise<bigint>;
    getReportDataByName(name: string): Promise<{
        recommendations: Array<FundRecommendation>;
        riskProfile?: RiskProfile;
        projection?: SIPProjection;
        submission?: SIPSubmission;
    }>;
    getReportsGenerated(): Promise<bigint>;
    getSIPReport(sessionId: bigint, name: string): Promise<SIPSession>;
    getSipReportsBySessionIds(_name: string, startId: bigint, endId: bigint): Promise<Array<SIPSession>>;
    submitRiskProfile(name: string, riskScore: bigint): Promise<RiskProfile>;
    submitSIPDetails(name: string, monthlyAmount: bigint, goalAmount: bigint, yearlyInvestmentAmount: bigint, tenureYears: bigint, existingCorpus: bigint): Promise<[bigint, string, bigint, bigint, bigint, bigint, bigint]>;
}
