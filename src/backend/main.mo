import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Text "mo:core/Text";
import List "mo:core/List";
import Array "mo:core/Array";
import Runtime "mo:core/Runtime";



actor {
  // Risk Profile Types
  type RiskProfile = {
    riskScore : Nat;
    profileType : Text; // Conservative, Moderate, Aggressive
  };

  // SIP Submission - initial investment details
  type SIPSubmission = {
    investorName : Text;
    monthlyAmount : Nat;
    goalAmount : Nat;
    yearlyInvestmentAmount : Nat;
    tenureYears : Nat;
    existingCorpus : Nat;
  };

  // Fund recommendation
  type FundRecommendation = {
    fundName : Text;
    category : Text;
    cagr : Nat; // compounded annual growth rate in %
    sharpeRatio : Nat;
    riskScore : Nat; // 1 (low) - 10 (high)
    riskLevel : Text; // Low, Medium, High
  };

  // Projection result
  type SIPProjection = {
    totalInvested : Nat;
    projectedCorpus : Nat;
    wealthGain : Nat; // total gain
    projectedReturnRate : Nat;
  };

  // Consolidated session data
  type SIPSession = {
    id : Nat;
    submission : SIPSubmission;
    riskProfile : RiskProfile;
    recommendations : [FundRecommendation];
    projection : SIPProjection;
  };

  // Stable state
  var sessionIdCounter = 0;
  var reportCount = 0;
  let emailSignups = Map.empty<Text, ()>();
  let sipSubmissions = Map.empty<Text, SIPSubmission>();
  let riskProfiles = Map.empty<Text, RiskProfile>();
  let fundRecommendations = Map.empty<Text, [FundRecommendation]>();
  let projections = Map.empty<Text, SIPProjection>();
  let sessions = Map.empty<Nat, SIPSession>();

  // Submit SIP details and store them
  public shared ({ caller }) func submitSIPDetails(name : Text, monthlyAmount : Nat, goalAmount : Nat, yearlyInvestmentAmount : Nat, tenureYears : Nat, existingCorpus : Nat) : async (Nat, Text, Nat, Nat, Nat, Nat, Nat) {
    sessionIdCounter += 1;

    let submission : SIPSubmission = {
      investorName = name;
      monthlyAmount;
      goalAmount;
      yearlyInvestmentAmount;
      tenureYears;
      existingCorpus;
    };

    sipSubmissions.add(name, submission);

    (sessionIdCounter, name, monthlyAmount, goalAmount, yearlyInvestmentAmount, tenureYears, existingCorpus);
  };

  // Assess risk profile
  public shared ({ caller }) func submitRiskProfile(name : Text, riskScore : Nat) : async RiskProfile {
    var profileType = "Conservative";
    var riskNum = 1;

    if (riskScore <= 3) {
      riskNum := 1;
      profileType := "Conservative";
    } else if (riskScore <= 6) {
      riskNum := 2;
      profileType := "Moderate";
    } else {
      riskNum := 3;
      profileType := "Aggressive";
    };

    let riskProfile : RiskProfile = {
      riskScore;
      profileType;
    };

    riskProfiles.add(name, riskProfile);
    riskProfile;
  };

  // Return fund recommendations for a profile type
  public shared ({ caller }) func getFundRecommendations(profileType : Text) : async [FundRecommendation] {
    var recommendations : [FundRecommendation] = [];

    switch (profileType) {
      case ("Conservative") {
        recommendations := [
          {
            fundName = "ICICI Pru Balanced Advantage Fund";
            category = "Hybrid";
            cagr = 12;
            sharpeRatio = 9;
            riskScore = 3;
            riskLevel = "Low";
          },
          {
            fundName = "HDFC Hybrid Equity Fund";
            category = "Hybrid";
            cagr = 14;
            sharpeRatio = 12;
            riskScore = 3;
            riskLevel = "Low";
          },
          {
            fundName = "Nippon India Hybrid Bond Fund";
            category = "Hybrid";
            cagr = 10;
            sharpeRatio = 7;
            riskScore = 2;
            riskLevel = "Low";
          },
        ];
      };
      case ("Moderate") {
        recommendations := [
          {
            fundName = "Nippon Nifty 50 Index Fund";
            category = "Index";
            cagr = 15;
            sharpeRatio = 14;
            riskScore = 5;
            riskLevel = "Medium";
          },
          {
            fundName = "SBI Focused Equity Fund";
            category = "Focused";
            cagr = 17;
            sharpeRatio = 14;
            riskScore = 6;
            riskLevel = "Medium";
          },
          {
            fundName = "HDFC Balanced Advantage Fund";
            category = "Balanced";
            cagr = 14;
            sharpeRatio = 10;
            riskScore = 5;
            riskLevel = "Medium";
          },
          {
            fundName = "Mirae Asset Large Cap Fund";
            category = "Large Cap";
            cagr = 16;
            sharpeRatio = 13;
            riskScore = 6;
            riskLevel = "Medium";
          },
        ];
      };
      case ("Aggressive") {
        recommendations := [
          {
            fundName = "Axis Small Cap Fund";
            category = "Small Cap";
            cagr = 19;
            sharpeRatio = 7;
            riskScore = 8;
            riskLevel = "High";
          },
          {
            fundName = "Nippon Pharma Fund";
            category = "Sectoral";
            cagr = 20;
            sharpeRatio = 11;
            riskScore = 9;
            riskLevel = "High";
          },
        ];
      };
      case (_) { recommendations := [] };
    };

    recommendations;
  };

  // Calculate SIP projection using correct formula
  public shared ({ caller }) func calculateSIPProjection(name : Text, monthlyAmount : Nat, tenureYears : Nat, expectedReturnRate : Nat) : async SIPProjection {
    let totalMonths = tenureYears * 12;
    let totalInvested = monthlyAmount * 12 * tenureYears;
    var corpus : Nat = 0;
    var i = 0;

    while (i < totalMonths) {
      corpus := corpus + monthlyAmount;
      // Apply monthly compounding
      corpus := corpus * (12000 + expectedReturnRate) / 12000;
      i += 1;
    };

    let gain = if (corpus > totalInvested) { corpus - totalInvested } else { 0 : Nat };

    let projection : SIPProjection = {
      totalInvested;
      projectedCorpus = corpus;
      wealthGain = gain;
      projectedReturnRate = expectedReturnRate;
    };

    projections.add(name, projection);
    projection;
  };

  // Get consolidated SIP report
  public shared ({ caller }) func getSIPReport(sessionId : Nat, name : Text) : async SIPSession {
    let submission = switch (sipSubmissions.get(name)) {
      case (?sub) { sub };
      case (null) { Runtime.trap("No SIP submission found for name") };
    };

    let riskProfile = switch (riskProfiles.get(name)) {
      case (?risk) { risk };
      case (null) { Runtime.trap("No risk profile found for name") };
    };

    let recommendations = switch (fundRecommendations.get(name)) {
      case (?recs) { recs };
      case (null) { [] };
    };

    let projection = switch (projections.get(name)) {
      case (?proj) { proj };
      case (null) { Runtime.trap("No projections found for name") };
    };

    let session : SIPSession = {
      id = sessionId;
      submission;
      riskProfile;
      recommendations;
      projection;
    };

    sessions.add(sessionId, session);
    reportCount += 1;

    session;
  };

  // Return count of reports generated
  public query ({ caller }) func getReportsGenerated() : async Nat {
    reportCount;
  };

  // Return count of registered emails
  public query ({ caller }) func getRegisteredEmailCount() : async Nat {
    emailSignups.size();
  };

  // Get all stored SIP data for a given name
  public shared ({ caller }) func getReportDataByName(name : Text) : async {
    submission : ?SIPSubmission;
    riskProfile : ?RiskProfile;
    recommendations : [FundRecommendation];
    projection : ?SIPProjection;
  } {
    let recs = switch (fundRecommendations.get(name)) {
      case (?r) { r };
      case (null) { [] };
    };

    {
      submission = sipSubmissions.get(name);
      riskProfile = riskProfiles.get(name);
      recommendations = recs;
      projection = projections.get(name);
    };
  };

  // Function to get all SIP reports for a specified range of session ids
  public shared ({ caller }) func getSipReportsBySessionIds(_name : Text, startId : Nat, endId : Nat) : async [SIPSession] {
    if (startId > endId) {
      let emptyList = List.empty<SIPSession>();
      return emptyList.toArray();
    };

    let range = List.empty<Nat>();

    let results = range.toArray().map(
      func(sid) {
        switch (sessions.get(sid)) {
          case (?session) { session };
          case (null) {
            Runtime.trap("Session ID not found");
          };
        };
      }
    );
    results;
  };
};
