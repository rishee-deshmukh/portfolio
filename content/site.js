// All site copy lives here. Every fact below comes from the updated CV
// (updated_master_cv.pdf), the public GitHub repos, or the original
// multi-agent project files. Items marked TODO need the owner's confirmation.

export const SITE = {
  url: "https://risheedeshmukh.com",
  name: "Rishee Deshmukh",
  role: "Software engineer",
  email: "us.rishee@gmail.com",
  github: "https://github.com/rishee-deshmukh",
  linkedin: "https://linkedin.com/in/rishee-deshmukh",
  resume: "/resume.pdf",
  // Formspree form ID (the part after /f/). Leave empty until the form exists;
  // the contact section then shows email only, so nothing is ever broken.
  formspreeId: "mjgnwjpv",
  description:
    "Rishee Deshmukh is a software engineer with an M.S. in Computer Science from Syracuse University, working on backend and cloud systems (Go, AWS), full-stack web, security and AI.",
};

export const INTRO = {
  eyebrow: "Software engineer · M.S. Computer Science, Syracuse University",
  lede: "I build backend services, full-stack platforms and security-minded systems. Currently working in Go on AWS.",
  proof: [
    { head: "Go · DynamoDB · ECS Fargate", sub: "Backend engineer at ZenZiee Corp." },
    { head: "~50% AWS cost reduction", sub: "Identified in an infrastructure cost analysis" },
    { head: "Peer-reviewed", sub: "Co-authored e-voting paper, Int. J. of Electronic Governance (2024)" },
  ],
};

export const PROJECTS = [
  {
    slug: "multi-agent-code-review",
    title: "Multi-agent code review",
    year: "2026",
    tag: "v1 and v2",
    summary:
      "Parallel LangGraph agents plus static analysers (Semgrep, Bandit, Ruff, ESLint). Built twice: a first version that reached 90% recall, then a rebuild with a controlled evaluation of what the multi-agent design really adds.",
    stack: ["Python", "FastAPI", "LangGraph", "React", "TypeScript", "Supabase", "Semgrep", "Bandit", "Ruff", "ESLint"],
    links: [
      { label: "v2 repository on GitHub", href: "https://github.com/rishee-deshmukh/Multi-Agent-Code-Review-System" },
    ],
    sections: [
      {
        heading: "The idea",
        body: [
          "Most automated reviewers run one model over the code and return a flat list of warnings. This project splits the job: three specialist agents (security, performance, maintainability) run in parallel, grounded by static analysis, and a synthesizer merges and deduplicates their findings and proposes fixed code.",
        ],
      },
      {
        heading: "Version 1: build it, measure it",
        bullets: [
          "LangGraph fan-out/fan-in pipeline: three specialist agents on Claude Haiku 4.5 and a Claude Sonnet 4.6 synthesizer for deduplication and gap analysis.",
          "Static analysis (Semgrep, Bandit, Ruff, ESLint) combined with LLM semantic reasoning.",
          "Full-stack platform on FastAPI, React and Supabase, with server-sent events streaming each agent's findings as they finish.",
        ],
        stats: [
          { value: "90%", label: "recall on 30 labeled issues (27 of 30)" },
          { value: "52.3 s", label: "average processing time per file" },
        ],
        note: "27 of 30 includes 5 performance issues: 22 of 25 security issues and 5 of 5 performance issues were found. The 30 labels sit on 20 Python and 10 JavaScript sample files. January to May 2026.",
      },
      {
        heading: "What the numbers pointed to",
        body: [
          "Recall is one side of a reviewer's job, so I looked at the rest of the same run: precision was 0.21 (102 false positives across 129 predictions), F1 was 0.34 and severity accuracy was 0.37, with no baseline to compare against.",
          "Those figures set the agenda for version 2: measure precision properly, and test whether four agents earn their cost against simpler approaches.",
        ],
      },
      {
        heading: "Version 2: a controlled evaluation",
        body: [
          "The rebuild treats evaluation as the main deliverable. Four systems were scored on a held-out set of 67 files (56 labeled issues, 14 clean files) with strict matching on file, category, vulnerability class and line: static tools only, a single LLM prompt, the multi-agent graph without static findings, and the full system.",
          "Every model response is cached and committed, so the whole comparison replays offline with identical results (4 systems across 97 files, 0 differences).",
        ],
        stats: [
          { value: "0.79", label: "recall of the full pipeline on held-out files" },
          { value: "0.13 → 0.47+", label: "recall on performance issues: static tools alone versus the LLM systems" },
        ],
      },
      {
        heading: "What I learned",
        body: [
          "A single prompt (F1 0.70) and the static tools alone (F1 0.68) are strong baselines. The full pipeline (F1 0.37) found about as much, but reported roughly three findings per clean file, so precision is the open problem. The evaluation also shows where the extra agents help: they recover performance issues that static tools largely miss.",
          "Why the pipeline is noisy is still untested. My hypothesis is that each specialist, asked to review its own domain, nearly always returns something. Letting agents return nothing, or filtering in the synthesizer, are the next experiments, and they would need a fresh held-out set. The repository documents the protocol and its limits: one labeler, a small synthetic set, one run per system.",
        ],
      },
    ],
  },
  {
    slug: "securechat",
    title: "SecureChat",
    year: "2025",
    tag: "Cryptography",
    summary:
      "End-to-end encrypted messaging protocol: X25519 key exchange, ChaCha20-Poly1305, HKDF, key ratcheting and replay protection.",
    stack: ["Python", "X25519", "ChaCha20-Poly1305", "HKDF-SHA256", "Bloom filter"],
    links: [],
    sections: [
      {
        heading: "What it is",
        body: [
          "A client-server encrypted chat application built to understand modern messaging cryptography by implementing it, from key exchange to per-message key derivation.",
        ],
      },
      {
        heading: "Design decisions",
        bullets: [
          "X25519 Diffie-Hellman key exchange, with ChaCha20-Poly1305 authenticated encryption and HKDF-SHA256 key derivation.",
          "Replay-attack prevention using Bloom filter-based message ID tracking plus timestamp validation with a TTL.",
          "Signal-inspired key ratcheting that derives a fresh encryption key for every message, giving forward secrecy.",
        ],
      },
    ],
    privateNote: "Source is not public. This write-up is based on my notes and CV.",
  },
  {
    slug: "e-ballot",
    title: "E-Ballot",
    year: "2023",
    tag: "Blockchain",
    summary:
      "Ethereum voting system built from three Solidity contracts: efficiency score 66.67, an estimated 4.3× a traditional system, in a co-authored journal article.",
    stack: ["Ethereum", "Solidity", "Web3.js", "MetaMask", "React", "Truffle"],
    links: [
      { label: "Repository on GitHub", href: "https://github.com/rishee-deshmukh/E-Ballot-Blockchain-Based-Voting-System" },
      { label: "Published paper (DOI)", href: "https://doi.org/10.1504/IJEG.2024.142405" },
    ],
    sections: [
      {
        heading: "What it is",
        body: [
          "A decentralized e-voting system on Ethereum, developed as an academic project at Medi-Caps University and published with co-authors as “Blockchain powered e-voting: a step towards transparent governance”, International Journal of Electronic Governance, vol. 16, no. 3, pp. 354–377 (2024).",
        ],
      },
      {
        heading: "Design decisions and results",
        bullets: [
          "Three Solidity smart contracts, optimized for gas efficiency; the Voting contract consumed 734,353 gas per deployment.",
          "Web3.js with MetaMask for trustless, wallet-based voter authentication and real-time on-chain vote verification.",
        ],
        stats: [
          { value: "66.67", label: "efficiency score: 800 votes in 60 minutes × 5 candidates (as reported in the paper)" },
          { value: "4.3×", label: "estimated efficiency ratio against a traditional system, per the paper’s analytical model" },
        ],
      },
    ],
  },
  {
    slug: "text-simplification",
    title: "Text simplification",
    year: "2025",
    tag: "NLP",
    summary:
      "T5-small fine-tuned on 50,000 WikiAuto sentence pairs and benchmarked against BART and a zero-shot Phi-3 Mini.",
    stack: ["Python", "PyTorch", "HuggingFace", "T5", "WikiAuto", "ASSET"],
    links: [],
    sections: [
      {
        heading: "What it is",
        body: [
          "An end-to-end machine-learning pipeline for automatic text simplification, evaluated on the ASSET benchmark.",
        ],
      },
      {
        heading: "What I built and learned",
        bullets: [
          "Fine-tuned T5-small on 50,000 WikiAuto pairs with mixed-precision (FP16) training and gradient accumulation.",
          "Multi-metric evaluation: SARI, BLEU, ROUGE-L and Flesch Reading Ease, against BART and a zero-shot Phi-3 Mini.",
          "Reference-based metrics and readability disagree: zero-shot LLMs scored the highest Flesch score (59.6), while the supervised models maximized BLEU and ROUGE through conservative edits.",
        ],
      },
    ],
    privateNote: "Source is not public. This write-up is based on my notes and CV.",
  },
  {
    slug: "password-manager",
    title: "Password manager",
    year: "2026",
    tag: "Desktop · Security",
    summary:
      "C++ desktop password manager with a Qt interface, master-password protection and libsodium-based encrypted local storage.",
    stack: ["C++", "Qt", "CMake", "libsodium"],
    links: [],
    sections: [
      {
        heading: "What it is",
        body: [
          "A desktop password manager written in C++ with a Qt graphical interface, covering full credential create, read, update and delete operations on top of encrypted local storage.",
        ],
      },
      {
        heading: "Design decisions",
        bullets: [
          "Master-password protection and secure password generation built on libsodium cryptographic primitives.",
          "Build system managed with CMake, with hands-on memory management and object-oriented design in a security-sensitive application.",
        ],
      },
    ],
    privateNote: "Source is not public. This write-up is based on my notes and CV.",
  },
];

export const EXPERIENCE = [
  {
    role: "Backend Engineer (AWS)",
    org: "ZenZiee Corp.",
    place: "Remote",
    dates: "Jul 2026 – Present",
    bullets: [
      "Developed backend services in Go with DynamoDB, ElastiCache Redis, ECS Fargate and WebSocket integration on AWS.",
      "Refactored DynamoDB table schemas to remove redundant data storage and added query pagination with Global Secondary Indexes, reducing read throttles.",
      "Analyzed AWS costs across ECS Fargate, ElastiCache, DynamoDB and networking, identifying roughly 50% savings through right-sizing and provisioning changes.",
      "Replaced a hand-rolled salt-and-concatenate scheme with standard bcrypt (cost 12, unique random salt per user) and lazy rehash on login, so existing accounts upgrade automatically; built, tested and submitted for review in 4 days.",
    ],
  },
  {
    role: "Full-Stack Developer",
    org: "iConsult Collaborative, Syracuse University",
    place: "Syracuse, NY",
    dates: "Nov 2025 – May 2026",
    bullets: [
      "Designed and developed full-stack web application modules with React and Next.js in a TypeScript codebase.",
      "Evaluated system design trade-offs across frontend frameworks to improve modularity and maintainability.",
      "Implemented CI/CD pipelines with GitHub Actions within Agile development cycles.",
    ],
  },
  {
    role: "Network Engineering Intern",
    org: "Cisco",
    place: "Indore, India",
    dates: "May – Jul 2023",
    bullets: [
      "Configured and deployed switches, routers and end devices for reliable local and remote connectivity.",
      "Designed IPv4/IPv6 addressing schemes supporting scalable network segmentation.",
    ],
  },
];

export const EDUCATION = [
  {
    school: "Syracuse University",
    degree: "Master of Science, Computer Science",
    detail: "GPA 3.47 / 4.0",
    dates: "May 2026",
  },
  {
    school: "Medi-Caps University",
    degree: "Bachelor of Technology, Computer Science and Engineering",
    detail: "",
    dates: "May 2024",
  },
];

export const SKILLS = [
  { group: "Languages", items: "Python, Go, Java, JavaScript, TypeScript, C, C++, C#, Solidity" },
  { group: "Backend", items: "Node.js, Express.js, FastAPI, Django, Kafka, REST APIs, WebSockets, Server-Sent Events" },
  { group: "Frontend", items: "React, Next.js, HTML5, CSS3, Tailwind CSS" },
  { group: "Data", items: "PostgreSQL, DynamoDB, MySQL, MongoDB, Redis, Supabase, Oracle" },
  { group: "Cloud and DevOps", items: "AWS (ECS Fargate, ElastiCache), GCP, Docker, Kubernetes, Git, GitHub Actions, CMake" },
  { group: "AI and ML", items: "TensorFlow, PyTorch, Scikit-learn, HuggingFace, LangGraph, LLM integration, NumPy" },
  { group: "Security and networking", items: "Applied cryptography (X25519, ChaCha20-Poly1305, HKDF), bcrypt, libsodium, Semgrep, Bandit, Cisco IOS, IPv4/IPv6, VLAN, ACLs" },
  { group: "Blockchain and desktop", items: "Ethereum, smart contracts, Web3.js, Qt" },
];

export const OFF_THE_CLOCK = {
  text: "I'm a better engineer when I'm not only an engineer. Guitar, competitive gaming, anime and comfort rewatches keep me curious, and keep me balanced.",
};
