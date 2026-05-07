export const portfolioContent = {
  home: {
    marqueeWords: [
      "progressive evidence refinement",
      "hybrid semantic matching",
      "confidence-aware location reasoning",
      "private question verification",
      "fraud-aware oversight",
      "institutional recovery workflow",
      "progressive evidence refinement",
      "secure contact release",
    ],
    hero: {
      kicker: "SLIIT final year research portfolio",
      title: ["FindAssure", "turns evidence", "into recovery"],
      description:
        "FindAssure addresses fragmented campus lost-and-found workflows by treating recovery as a progressive evidence refinement problem. Images, descriptions, indoor location memory, private verification answers, and admin oversight work together before finder details are released.",
      primaryCta: "Explore system",
      secondaryCta: "View research",
    },
    heroPanels: {
      finder: {
        label: "Finder intake",
        index: "01",
        description:
          "Recovered items enter the system with photos, structured indoor location labels, and private answers that remain hidden from claimants.",
      },
      owner: {
        label: "Owner claim",
        description:
          "Owners search using noisy descriptions, optional images, and confidence-based location clues instead of exact GPS.",
      },
      admin: {
        label: "Admin oversight",
        description:
          "Suspicious attempts, uncertain claims, and secure handover decisions stay visible to institutional reviewers.",
      },
      signals: ["Visual evidence", "Hybrid ranking", "Secure release"],
    },
    contributions: [
      {
        title: "Unified recovery architecture",
        detail:
          "A single workflow connects mobile reporting, orchestration services, and AI subsystems for medium-sized institutional environments.",
      },
      {
        title: "Hybrid semantic matching",
        detail:
          "Dense retrieval, keyword overlap, and cross-stage ranking narrow plausible matches before ownership is tested.",
      },
      {
        title: "Confidence-aware location logic",
        detail:
          "Indoor search space expands or tightens based on how certain the owner is about building, floor, hall, or ground area.",
      },
      {
        title: "Verification before release",
        detail:
          "Finder contact details remain hidden until multimodal verification and review signals indicate a trustworthy claim.",
      },
    ],
    processColumns: [
      {
        title: "Capture",
        caption: "Evidence enters the workflow",
        color: "bg-accent-teal",
        items: [
          "Finder photos become machine-usable visual evidence",
          "Structured campus locations anchor the first search scope",
          "Private answers are stored for later ownership checks",
          "Public listings exclude sensitive handover details",
        ],
      },
      {
        title: "Match",
        caption: "Candidates are narrowed carefully",
        color: "bg-accent-pink",
        items: [
          "Hybrid semantic retrieval balances recall and precision",
          "Keyword overlap protects exact identifiers and rare phrases",
          "Confidence-aware location expansion reflects real memory gaps",
          "Ranked results expose plausible matches, not proof of ownership",
        ],
      },
      {
        title: "Protect",
        caption: "Trust is preserved through verification",
        color: "bg-accent-orange",
        items: [
          "Item-specific questions raise the cost of guessing",
          "Video answers add transcript and behavioral evidence",
          "Rule checks and semantic scoring support admin review",
          "Finder details release only after successful verification",
        ],
      },
    ],
    principles: [
      { number: "1", title: "retrieve", color: "bg-accent-teal" },
      { number: "2", title: "verify", color: "bg-accent-pink" },
      { number: "3", title: "protect", color: "bg-accent-orange" },
    ],
    rationale: {
      title: "One recovery pipeline with matching, verification, and governance built together",
      description:
        "The portfolio now emphasizes the same argument made in the paper: institutional lost-and-found systems fail when retrieval, ownership proof, and safe release are treated as separate problems.",
      bullets: [
        "Manual posting and browsing are slow when many items look alike.",
        "Owners remember locations semantically, not as exact coordinates.",
        "Plausible matches still need private evidence before a handover is safe.",
        "Behavioral signals support review, but they do not replace human oversight.",
      ],
    },
    researchStack: [
      "Mobile client",
      "Orchestration backend",
      "Visual evidence extraction",
      "Hybrid semantic retrieval",
      "Indoor location reasoning",
      "Ownership verification",
      "Fraud monitoring",
      "Secure release policy",
    ],
    featureCards: [
      {
        title: "System architecture",
        detail:
          "Follow the service-oriented stack from user interfaces to matching, verification, and fraud analytics.",
        to: "/work",
      },
      {
        title: "Research methodology",
        detail:
          "See how multimodal evidence, indoor memory, evaluation, and governance shape the paper’s core argument.",
        to: "/about",
      },
      {
        title: "Team and repository",
        detail:
          "Review the contributor lanes behind the portfolio and open the public codebase from the team page.",
        to: "/team",
      },
    ],
    footer:
      "FindAssure is presented here as a secure, evidence-driven recovery system for university and institutional settings rather than a simple listing board.",
  },
  work: {
    hero: {
      kicker: "System architecture",
      title: ["A service stack", "for recovery,", "verification, and review"],
      description:
        "The architecture mirrors the paper’s workflow: a mobile experience collects evidence, an orchestration layer coordinates decisions, and specialized services handle visual understanding, hybrid retrieval, confidence-aware location reasoning, ownership verification, and fraud-aware monitoring.",
    },
    stageColumns: [
      {
        title: "Experience",
        color: "bg-accent-teal",
        items: ["Finder reporting", "Owner search and claim", "Administrator review"],
      },
      {
        title: "Orchestration",
        color: "bg-accent-pink",
        items: [
          "Workflow coordination backend",
          "Data persistence and item state",
          "Secure release and review logic",
        ],
      },
      {
        title: "Intelligence",
        color: "bg-accent-orange",
        items: [
          "Visual evidence extraction",
          "Hybrid semantic retrieval",
          "Verification and fraud analytics",
        ],
      },
    ],
    modules: [
      {
        title: "Mobile client",
        layer: "User interface",
        stack: "React Native + Expo",
        detail:
          "Handles found-item intake, owner-side query submission, and short video answers for the verification stage.",
        footprint: "FindAssure/",
      },
      {
        title: "Orchestration backend",
        layer: "Workflow core",
        stack: "Node.js + Express",
        detail:
          "Coordinates item lifecycle, user roles, service calls, and the secure release policy that hides finder details until verification is complete.",
        footprint: "Backend/",
      },
      {
        title: "Image understanding",
        layer: "Visual evidence",
        stack: "FastAPI + YOLOv8m + Florence-2",
        detail:
          "Detects the recovered item, extracts captions and visible text, and turns photos into structured evidence for search and verification.",
        footprint: "Image-Processing-&-Object-Recognition-Pipeline/",
      },
      {
        title: "Semantic retrieval",
        layer: "Candidate ranking",
        stack: "Dense + sparse retrieval",
        detail:
          "Combines semantic matching, keyword overlap, and re-ranking so owner descriptions can still surface the right item when wording differs.",
        footprint: "AI-Powered-Semantic-Machine-and-Data-Modeling-Engine/",
      },
      {
        title: "Location reasoning",
        layer: "Indoor context",
        stack: "Structured confidence logic",
        detail:
          "Expands or constrains building, floor, hall, and ground-area search space according to the owner’s confidence level.",
        footprint: "Sugestion_python/",
      },
      {
        title: "Ownership verification",
        layer: "Claim validation",
        stack: "Transcription + semantic similarity + rules",
        detail:
          "Checks video answers against private, item-specific evidence using transcript similarity, question-aware rules, and advisory reasoning support.",
        footprint: "Similarity_python/",
      },
      {
        title: "Fraud monitoring",
        layer: "Governance",
        stack: "Behavioral review signals",
        detail:
          "Summarizes repeated attempts, inconsistent replies, and suspicious interaction patterns for administrators without treating them as proof of deception.",
        footprint: "Backend/ + admin dashboards",
      },
    ],
    workflowSteps: [
      {
        index: "01",
        title: "Found-item intake",
        description:
          "A finder reports the item with photos, category, semantic location labels, and private answers that remain hidden.",
      },
      {
        index: "02",
        title: "Candidate retrieval",
        description:
          "Hybrid semantic matching and confidence-aware location logic produce a prioritized shortlist of plausible matches.",
      },
      {
        index: "03",
        title: "Ownership verification",
        description:
          "The claimant answers item-specific questions through short videos that are transcribed and checked with semantic and rule-based scoring.",
      },
      {
        index: "04",
        title: "Secure release",
        description:
          "Finder contact details are disclosed only after the claim clears verification and review conditions.",
      },
    ],
  },
  about: {
    hero: {
      kicker: "Research methodology",
      title: ["The method treats", "recovery as an", "evidence pipeline"],
      description:
        "The paper frames FindAssure for medium-sized institutional environments where manual lost-and-found practices are fragmented, indoor memory is uncertain, and premature information release can invite fraudulent claims.",
    },
    principles: [
      { number: "1", title: "evidence", color: "bg-accent-teal" },
      { number: "2", title: "ranking", color: "bg-accent-pink" },
      { number: "3", title: "governance", color: "bg-accent-orange" },
    ],
    intro: {
      title: "The methodology stays practical for campus-scale ambiguity",
      description:
        "FindAssure does not assume perfect item descriptions, exact coordinates, or fully trustworthy claimants. Each subsystem adds structured evidence while preserving human review where the paper identifies risk.",
    },
    sections: [
      {
        title: "Visual evidence",
        name: "Visual evidence",
        role: "Multimodal item understanding",
        accent: "bg-accent-teal",
        summary:
          "YOLO-based detection, Florence-2 extraction, and reusable embeddings turn found-item images into captions, OCR signals, and searchable evidence.",
      },
      {
        title: "Hybrid retrieval",
        name: "Hybrid retrieval",
        role: "Semantic matching",
        accent: "bg-accent-pink",
        summary:
          "Dense retrieval, sparse keyword matching, and re-ranking work together so noisy owner descriptions still surface strong candidates.",
      },
      {
        title: "Indoor reasoning",
        name: "Indoor reasoning",
        role: "Confidence-aware location expansion",
        accent: "bg-accent-coral",
        summary:
          "Building, floor, hall, and ground-area labels expand differently depending on whether the owner is pretty sure, sure, unsure, or has no idea.",
      },
      {
        title: "Privacy and governance",
        name: "Verified release",
        role: "Ownership and fraud review",
        accent: "bg-accent-orange",
        summary:
          "Private question answers, transcript similarity, rule checks, and behavioral review signals reduce false acceptance before handover details are exposed.",
      },
    ],
    methods: [
      "YOLOv8m object detection",
      "Florence-2 caption and OCR extraction",
      "Embeddings for semantic retrieval",
      "Dense + sparse ranking strategy",
      "Confidence-aware location expansion",
      "Video-answer transcription",
      "Rule-enhanced ownership scoring",
      "Admin-facing fraud review signals",
    ],
    evaluation: {
      title: "Evaluation and governance are part of the research argument",
      description:
        "The paper evaluates retrieval quality, ownership verification reliability, and fraud-monitoring usefulness separately, while also treating privacy and reviewability as deployment requirements.",
      bullets: [
        "Retrieval metrics: Recall@K, MRR, nDCG, and Precision@K.",
        "Verification metrics: accuracy, F1, false accept rate, false reject rate, and time to decision.",
        "Fraud analytics: predictive utility plus administrator-centered review usefulness.",
        "Privacy and governance: delayed finder-detail release, role-based access, auditable review logs, and cautious use of behavioral signals.",
      ],
    },
  },
  team: {
    hero: {
      kicker: "Project team",
      title: ["Meet the four", "member roles", "behind FindAssure"],
      description:
        "This page is dedicated to the project team only. It highlights the four member responsibilities that shape FindAssure across research framing, user experience, orchestration, and AI-backed verification.",
    },
    summary: {
      title: "Dedicated to building secure and intuitive institutional recovery",
      description:
        "FindAssure is a SLIIT final year research project focused on creating a multimodal, privacy-preserving lost-and-found system. The team is structured around four core pillars: visual evidence extraction, semantic retrieval, secure ownership verification, and behavioral analytics.",
    },
    relatedInfo: [
      {
        label: "Institution",
        value: "Sri Lanka Institute of Information Technology",
      },
      {
        label: "Project type",
        value: "Final year research project",
      },
      {
        label: "System focus",
        value: "AI-powered lost-and-found for institutional environments",
      },
      {
        label: "Repository",
        value: "GitHub documentation and implementation workspace",
      },
    ],
    members: [
      {
        name: "Yehara Dananjaya",
        role: "Image Processing Lead",
        initials: "YD",
        bio: "Responsible for designing and building the Image Processing and Object Recognition Pipeline that drives multimodal item retrieval across the platform.",
        contribution: "Image Processing & Object Recognition Pipeline",
        components: [
          "Image processing pipeline",
          "Object recognition",
          "Visual evidence extraction",
          "Model integration",
        ],
        contacts: {
          email: "yeharadananjaya@gmail.com",
          github: "https://github.com/LSYDananjaya",
          linkedin: "https://www.linkedin.com/in/yehara-dananjaya/",
          portfolio: "https://yehara.online",
          phone: "",
        },
        image: "/team/yehara.jpg",
        accent: "bg-accent-teal",
      },
      {
        name: "Osanda Muthukumarana",
        role: "Semantic Matching Lead",
        initials: "OM",
        bio: "Co-leads the AI Powered Semantic Matching and Data Modeling Engine, focusing on model integration, feature engineering, and evidence pipeline orchestration.",
        contribution: "AI Powered Semantic Matching And Data Modeling Engine",
        components: [
          "Semantic matching engine",
          "Data modeling",
          "Feature engineering",
          "Pipeline orchestration",
        ],
        contacts: {
          email: "osandam23@gmail.com",
          github: "https://github.com/osa623",
          linkedin: "https://www.linkedin.com/in/osanda623",
          portfolio: "",
          phone: "",
        },
        image: "/team/osanda.jpg",
        accent: "bg-accent-pink",
      },
      {
        name: "Pawara Sasmina",
        role: "Verification & Security Lead",
        initials: "PS",
        bio: "Owns the Ownership Confirmation and Secure Handover Module, ensuring that claim verification and privacy-preserving disclosure work reliably in the recovery workflow.",
        contribution: "Ownership confirmation and secure handover module",
        components: [
          "Ownership confirmation",
          "Secure handover module",
          "Privacy disclosure",
          "Claim verification",
        ],
        contacts: {
          email: "pawarasasmina1@gmail.com",
          github: "https://github.com/Pawarasasmina",
          linkedin: "https://linkedin.com/in/pawarasasmina",
          portfolio: "https://pawara.online",
          phone: "",
        },
        image: "/team/pawara.jpg",
        accent: "bg-accent-coral",
      },
      {
        name: "Sankalani Senanayaka",
        role: "Analytics & Governance Lead",
        initials: "SS",
        bio: "Develops the Enhanced Smart Recommendation and Multi-Model Behavior Analytics Engine, supporting fraud-aware administration and behaviour-driven monitoring.",
        contribution: "Enhanced Smart Recommendation and Multi model behavior analytics engine",
        components: [
          "Smart recommendation",
          "Behavior analytics engine",
          "Fraud-aware administration",
          "Behaviour monitoring",
        ],
        contacts: {
          email: "sensankalani01@gmail.com",
          github: "https://github.com/SankalaniS",
          linkedin: "https://www.linkedin.com/in/sankalani-senanayaka-b775192b2/",
          portfolio: "",
          phone: "",
        },
        image: "/team/sankalani.jpg",
        accent: "bg-accent-orange",
      },
    ],
  },
} as const;

export type PortfolioContent = typeof portfolioContent;
