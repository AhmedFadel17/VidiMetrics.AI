import { useState, useEffect, useRef } from "react";
import { useAppSelector } from "@/store/hooks";
import apiClient from "@/api/client";
import { toast } from "sonner";
import Breadcrumbs from "@/components/ui/Breadcrumbs";

// Interfaces for our Wizard data models
interface Character {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  dataAlt: string;
  selected: boolean;
  isEditing: boolean;
}

interface Environment {
  id: string;
  name: string;
  details: string;
  imageUrl: string;
  dataAlt: string;
  selected: boolean;
  isEditing: boolean;
}

interface Scene {
  sceneId: string;
  imageUrl: string | null;
  narration: string;
  description: string;
}

interface Episode {
  episodeNumber: number;
  status: "Completed" | "Processing" | "In Queue";
  scenes: Scene[];
}

interface GenerationStatus {
  overallProgress: number;
  currentStatus: string;
  episodes: Episode[];
}

export default function Storyboarder() {
  const token = useAppSelector((state) => state.auth?.token);

  // ==========================================
  // ⚙️ STATE MACHINE
  // ==========================================
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [loadingState, setLoadingState] = useState<"idle" | "analyzing" | "executing" | "polling" | "error">("idle");

  // Step 1 Form States (Note: aspectPratio matches typo as requested)
  const [mainPrompt, setMainPrompt] = useState<string>("");
  const [enableEpisodes, setEnableEpisodes] = useState<boolean>(true);
  const [episodeCount, setEpisodeCount] = useState<number>(3);
  const [splitStrategy, setSplitStrategy] = useState<string>("Continuous Arc");
  const [artStyle, setArtStyle] = useState<string>("Cinematic");
  const [aspectPratio, setAspectPratio] = useState<string>("16:9");

  // Step 2 Extracted Assets
  const [characters, setCharacters] = useState<Character[]>([]);
  const [environments, setEnvironments] = useState<Environment[]>([]);

  // Step 3 Polling / Generation States
  const [generationJobId, setGenerationJobId] = useState<string | null>(null);
  const [generationStatus, setGenerationStatus] = useState<GenerationStatus | null>(null);
  const [activeEpisodeIndex, setActiveEpisodeIndex] = useState<number>(0);

  // Ref to track if mock fallback mode is active
  const isMockModeRef = useRef<boolean>(false);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Clean up polling interval on unmount
  useEffect(() => {
    return () => {
      if (pollingIntervalRef.current) {
        clearInterval(pollingIntervalRef.current);
      }
    };
  }, []);

  // ==========================================
  // 🧼 FORM VALIDATION & STEP TRANSITIONS
  // ==========================================
  const handleNextToStep2 = async () => {
    if (!mainPrompt.trim()) {
      toast.warning("Narrative Arc Prompt Required", {
        description: "Please specify the core storyline or concept to continue.",
      });
      return;
    }

    if (enableEpisodes && (episodeCount < 1 || episodeCount > 10)) {
      toast.warning("Invalid Episode Count", {
        description: "Please specify between 1 and 10 episodes.",
      });
      return;
    }

    // Transition to step 2 & analyze
    setCurrentStep(2);
    await analyzeNarrativePrompt();
  };

  // ==========================================
  // ⚡ BACKEND NETWORK HANDSHAKE POINTS
  // ==========================================

  /**
   * HANDSHAKE 1: POST /api/storyboard/analyze
   * Extract characters and environments from raw text prompt
   */
  const analyzeNarrativePrompt = async () => {
    setLoadingState("analyzing");
    isMockModeRef.current = false;

    const payload = {
      mainPrompt,
      enableEpisodes,
      episodeCount: enableEpisodes ? episodeCount : 1,
      splitStrategy,
      artStyle,
      aspectPratio,
    };

    console.log("Handshake 1 [POST /api/storyboard/analyze] Payload:", payload);

    try {
      const response = await apiClient.post("/api/storyboard/analyze", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const data = response.data?.data || response.data;

      // Bind characters and environments
      setCharacters(
        (data.characters || []).map((c: any, index: number) => ({
          id: c.id || `char_${index}`,
          name: c.name || "Unknown",
          role: c.role || "Character",
          imageUrl: c.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=200",
          dataAlt: c.dataAlt || "",
          selected: true,
          isEditing: false,
        }))
      );

      setEnvironments(
        (data.environments || []).map((e: any, index: number) => ({
          id: e.id || `env_${index}`,
          name: e.name || "Unknown Environment",
          details: e.details || "Environment description",
          imageUrl: e.imageUrl || "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=400",
          dataAlt: e.dataAlt || "",
          selected: true,
          isEditing: false,
        }))
      );

      setLoadingState("idle");
      toast.success("Analysis Complete", {
        description: `Identified ${data.characters?.length || 0} characters and ${data.environments?.length || 0} settings.`,
      });
    } catch (error: any) {
      console.warn("Handshake 1 failed. Activating intelligent local AI offline simulator...", error);
      isMockModeRef.current = true;

      // Simulate network delay for premium visual feedback
      setTimeout(() => {
        generateMockStep2Assets();
        setLoadingState("idle");
        toast.info("Offline Synthesis Active", {
          description: "Gateway not found. Synthesized local high-fidelity drafts.",
        });
      }, 1500);
    }
  };

  /**
   * HANDSHAKE 2: POST /api/storyboard/execute
   * Send the filtered/edited assets to begin background render job
   */
  const handleTriggerStoryboardExecution = async () => {
    setLoadingState("executing");

    const selectedCharacters = characters.filter((c) => c.selected);
    const selectedEnvironments = environments.filter((e) => e.selected);

    if (selectedCharacters.length === 0 && selectedEnvironments.length === 0) {
      toast.warning("No Assets Selected", {
        description: "Please include at least one Character or Environment to generate.",
      });
      setLoadingState("idle");
      return;
    }

    const payload = {
      mainPrompt,
      artStyle,
      aspectPratio,
      episodeCount: enableEpisodes ? episodeCount : 1,
      characters: selectedCharacters.map((c) => ({ name: c.name, role: c.role })),
      environments: selectedEnvironments.map((e) => ({ name: e.name, details: e.details })),
    };

    console.log("Handshake 2 [POST /api/storyboard/execute] Payload:", payload);

    // Transition immediately to step 3 layout
    setCurrentStep(3);

    if (isMockModeRef.current) {
      // Execute local mockup generation flow
      setTimeout(() => {
        const mockJobId = `job_${Math.random().toString(36).substr(2, 9)}`;
        setGenerationJobId(mockJobId);
        setLoadingState("polling");
        startPollingLifecycle(mockJobId);
      }, 1200);
      return;
    }

    try {
      const response = await apiClient.post("/api/storyboard/execute", payload, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });

      const jobId = response.data?.generationJobId || response.data?.jobId || "job_temp_123";
      setGenerationJobId(jobId);
      setLoadingState("polling");

      // Immediately open polling loop
      startPollingLifecycle(jobId);
    } catch (error) {
      console.warn("Handshake 2 failed. Resorting to local generation simulation...", error);
      isMockModeRef.current = true;

      const mockJobId = `job_mock_${Math.random().toString(36).substr(2, 9)}`;
      setGenerationJobId(mockJobId);
      setLoadingState("polling");
      startPollingLifecycle(mockJobId);
    }
  };

  /**
   * HANDSHAKE 3: GET /api/storyboard/status/{jobId}
   * Open dynamic polling interval loop to fetch real-time rendering stats
   */
  const startPollingLifecycle = (jobId: string) => {
    let mockTick = 0;

    // Clear any active polling loops
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    const fetchStatus = async () => {
      if (isMockModeRef.current) {
        mockTick++;
        updateMockStep3Lifecycle(mockTick);
        return;
      }

      try {
        console.log(`Handshake 3 [GET /api/storyboard/status/${jobId}] Polling...`);
        const response = await apiClient.get(`/api/storyboard/status/${jobId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });

        const data: GenerationStatus = response.data?.data || response.data;
        setGenerationStatus(data);

        // Check if fully finished
        if (data.overallProgress >= 100 || data.currentStatus === "Completed") {
          if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
          setLoadingState("idle");
          toast.success("Generation Complete!", {
            description: "Your full storyboard cinematic assets are ready.",
          });
        }
      } catch (error) {
        console.error("Polling error caught:", error);
        // We will continue polling unless it's a critical persistent failure,
        // but display a soft recovery indicator on UI.
      }
    };

    // First immediate tick
    fetchStatus();

    // 3-second cycle
    pollingIntervalRef.current = setInterval(fetchStatus, 3000);
  };

  // ==========================================
  // 🔮 OFFLINE GENERATOR & SIMULATION MOCKS
  // ==========================================
  const generateMockStep2Assets = () => {
    // Generate intelligent names and concepts reflecting user prompt keywords
    const lowerPrompt = mainPrompt.toLowerCase();

    let char1Name = "Kaelen";
    let char1Role = "The Rogue Cyborg";
    let char2Name = "Dr. Aris";
    let char2Role = "The Quantum Architect";
    let envName = "The Void Station";
    let envDetails = "Sleek orbital hub overlooking a violent neon nebula.";

    if (lowerPrompt.includes("detective") || lowerPrompt.includes("noir") || lowerPrompt.includes("police")) {
      char1Name = "Agent Vance";
      char1Role = "Disillusioned Detective";
      char2Name = "ECHO";
      char2Role = "Holographic AI Partner";
      envName = "Sector 7 Rain-Alley";
      envDetails = "Saturated vertical blocks slick with chemical rain and glitching billboards.";
    } else if (lowerPrompt.includes("fantasy") || lowerPrompt.includes("magic") || lowerPrompt.includes("sword")) {
      char1Name = "Sylas of the Veil";
      char1Role = "Runic Mage-Blade";
      char2Name = "Elder Vaelon";
      char2Role = "Keeper of the Rifts";
      envName = "The Whispering Spire";
      envDetails = "Glow-fungus lit stone ruins floating in low-gravity atmospheric pockets.";
    } else if (lowerPrompt.includes("space") || lowerPrompt.includes("alien") || lowerPrompt.includes("galaxy")) {
      char1Name = "Captain Rayne";
      char1Role = "Void Navigator";
      char2Name = "Xylar";
      char2Role = "Alien Envoy";
      envName = "Nebula Outpost Prime";
      envDetails = "Pressurized observation pod hovering near an active gravity vortex.";
    }

    setCharacters([
      {
        id: "char_1",
        name: char1Name,
        role: char1Role,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuA7qiVUsjOv4pCAXtZY86027bF9OxmTfVK6v4a3OpJWm7Cg0DOTYzizn0x7nviw7L2us_1fJL7ach8jbehvN-DsdqaxRfG6vWgcr7BgKEIQzv68PgRxximcgH7lsYxEyVtqvZ8nQlnigQuloOVncz6xksJPa6x8TXNy-6HqxwmaGKhNgDC4xy0Auxf17D6xtXPlhnVAj1XHyY3r2tF6Hp1XK_9Jfl8duiAM9liIZtSSYlnzumlatVCwx90m1dFllVv4gUlL7aBrsv0",
        dataAlt: "Cyborg design with glowing magenta eyes.",
        selected: true,
        isEditing: false,
      },
      {
        id: "char_2",
        name: char2Name,
        role: char2Role,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXuAORh3tJYO0wCyJDyg2ZWMOnQQ9aLFfXeTruqSwVdE9Af6bSzkcJ3flZl2ZlWra8uuAwCxOhl84k3jUYo_tE8E-bjWTuWiADg2_9q5lsAUElvyrmx2JyuzXBlFvZBkbYbZxpWQ0APh0ROA_d1WphjnCvY0IizlnuiGieQ9GGLNe9Okabpljm9aCUUOOpUwrnRC4Ynfwmz9-EpD3-J8ZHrWkNvpOVmNjRKBqCSB2ASrXB_o76SU1Xm83h82ljx_ZsePjDDrpThpONHE",
        dataAlt: "Portrait of senior character with high tech cyber-monocle.",
        selected: true,
        isEditing: false,
      },
    ]);

    setEnvironments([
      {
        id: "env_1",
        name: envName,
        details: envDetails,
        imageUrl: "https://lh3.googleusercontent.com/aida-public/AB6AXu-Df8Y5XBlKpRx6MM12HvH3En0QRtKldbv6f5KegowFo7DYykQu6gpx8mZd607lputa5QwTwDKEnPFI5ard-0fS1fMm_mYuMMQOSRODoXP6id0s5BzLTliUMe_3ITITh9r5i7StAGzFB9BpOlQK1NX4NCkpZ93poj4zUIEaGEnjx9MMbJOIqEKAotDtdhOA3lLvzzZNxT4m52sbl92Nd2WOhFQtfM-2VnUOt2zQtbfIYXiExJDeJFqlrhouWMGLqY5CEDzf2HAsJA",
        dataAlt: "Cinematic architecture looking out on gorgeous stars.",
        selected: true,
        isEditing: false,
      },
    ]);
  };

  const updateMockStep3Lifecycle = (tick: number) => {
    const totalEpisodes = enableEpisodes ? episodeCount : 1;
    const finalCharacters = characters.filter((c) => c.selected);
    const primaryChar = finalCharacters[0]?.name || "The Hero";

    // Progress updates based on ticks
    let progress = Math.min(tick * 15, 100);
    let statusText = "Assembling storyline layers...";

    if (progress < 25) {
      statusText = `Drafting Scene scripts and outlines for ${totalEpisodes} Episodes...`;
    } else if (progress < 50) {
      statusText = `Generating image assets for Episode 1...`;
    } else if (progress < 75) {
      statusText = `Rendering and synthethizing frames for Episode 2...`;
    } else if (progress < 95) {
      statusText = `Synchronizing narration tracks and building cinematic sequence outputs...`;
    } else {
      progress = 100;
      statusText = "Completed";
    }

    // Build synthetic episodes list
    const eps: Episode[] = [];
    for (let i = 1; i <= totalEpisodes; i++) {
      let epStatus: Episode["status"] = "In Queue";
      let scene1Img: string | null = null;
      let scene2Img: string | null = null;
      let scene1Text = "Narrative loading...";
      let scene2Text = "Visualizing draft...";

      if (progress >= 100) {
        epStatus = "Completed";
        scene1Img = "https://lh3.googleusercontent.com/aida-public/AB6AXuCuLY_tQihyqttfE_jUeu_Rj6SEb1Z51rECKoy-OKacm3_LJ0CMaFwctnF-ScWJNlJdx27Y-fAC6HXD39rlPWifj6YuksmNmPBgEcwuF5KL5stpL8wRpwdnKB8Ju_44XSWh8ONG1k_8YmNOa77IEJsJnRjCKk21iCY0PNEaOibTzFycDR0WcHRb_weI48NiPtrAb-cGjpfXqafZeXngM40Ha6Ho3y7AAiEmp-F__5T_27Xhutl32arLPOUcTB_mVNY1_pO8Rt7JN-c";
        scene2Img = "https://lh3.googleusercontent.com/aida-public/AB6AXu-Df8Y5XBlKpRx6MM12HvH3En0QRtKldbv6f5KegowFo7DYykQu6gpx8mZd607lputa5QwTwDKEnPFI5ard-0fS1fMm_mYuMMQOSRODoXP6id0s5BzLTliUMe_3ITITh9r5i7StAGzFB9BpOlQK1NX4NCkpZ93poj4zUIEaGEnjx9MMbJOIqEKAotDtdhOA3lLvzzZNxT4m52sbl92Nd2WOhFQtfM-2VnUOt2zQtbfIYXiExJDeJFqlrhouWMGLqY5CEDzf2HAsJA";
        scene1Text = `"${primaryChar} stands silently, witnessing reality dismantle at the molecular level."`;
        scene2Text = `"The station hums. They told us anomalies were rare. But they lied."`;
      } else if (i === 1) {
        // Episode 1 processing
        epStatus = progress >= 50 ? "Completed" : "Processing";
        scene1Img = progress >= 40 ? "https://lh3.googleusercontent.com/aida-public/AB6AXuCuLY_tQihyqttfE_jUeu_Rj6SEb1Z51rECKoy-OKacm3_LJ0CMaFwctnF-ScWJNlJdx27Y-fAC6HXD39rlPWifj6YuksmNmPBgEcwuF5KL5stpL8wRpwdnKB8Ju_44XSWh8ONG1k_8YmNOa77IEJsJnRjCKk21iCY0PNEaOibTzFycDR0WcHRb_weI48NiPtrAb-cGjpfXqafZeXngM40Ha6Ho3y7AAiEmp-F__5T_27Xhutl32arLPOUcTB_mVNY1_pO8Rt7JN-c" : null;
        scene1Text = progress >= 40 ? `"${primaryChar} steps onto the rain-slicked highway. The neon sky shifts violently."` : "Generating scene draft...";
      } else if (i === 2) {
        // Episode 2 processing
        epStatus = progress >= 75 ? "Completed" : (progress >= 50 ? "Processing" : "In Queue");
        if (progress >= 75) {
          scene1Img = "https://lh3.googleusercontent.com/aida-public/AB6AXu-Df8Y5XBlKpRx6MM12HvH3En0QRtKldbv6f5KegowFo7DYykQu6gpx8mZd607lputa5QwTwDKEnPFI5ard-0fS1fMm_mYuMMQOSRODoXP6id0s5BzLTliUMe_3ITITh9r5i7StAGzFB9BpOlQK1NX4NCkpZ93poj4zUIEaGEnjx9MMbJOIqEKAotDtdhOA3lLvzzZNxT4m52sbl92Nd2WOhFQtfM-2VnUOt2zQtbfIYXiExJDeJFqlrhouWMGLqY5CEDzf2HAsJA";
          scene1Text = `"${primaryChar} approaches the main gate. The blueprint anomalies are expanding."`;
        }
      }

      eps.push({
        episodeNumber: i,
        status: epStatus,
        scenes: [
          {
            sceneId: `ep_${i}_sc_1`,
            imageUrl: scene1Img,
            narration: scene1Text,
            description: `A close up action shot capturing the vivid aesthetic values of ${artStyle}.`,
          },
          {
            sceneId: `ep_${i}_sc_2`,
            imageUrl: scene2Img,
            narration: scene2Text,
            description: `Panoramic context capture configured at ${aspectPratio}.`,
          },
        ],
      });
    }

    setGenerationStatus({
      overallProgress: progress,
      currentStatus: statusText,
      episodes: eps,
    });

    if (progress >= 100) {
      if (pollingIntervalRef.current) clearInterval(pollingIntervalRef.current);
      setLoadingState("idle");
      toast.success("Simulation Completed", {
        description: "All synthetic story segments fully generated and integrated.",
      });
    }
  };

  // ==========================================
  // 🎭 STEP CARD HELPERS
  // ==========================================
  const handleToggleCharacterSelection = (id: string) => {
    setCharacters(
      characters.map((c) => (c.id === id ? { ...c, selected: !c.selected } : c))
    );
  };

  const handleToggleEnvironmentSelection = (id: string) => {
    setEnvironments(
      environments.map((e) => (e.id === id ? { ...e, selected: !e.selected } : e))
    );
  };

  const handleEditCharacter = (id: string, updatedFields: Partial<Character>) => {
    setCharacters(
      characters.map((c) => (c.id === id ? { ...c, ...updatedFields } : c))
    );
  };

  const handleEditEnvironment = (id: string, updatedFields: Partial<Environment>) => {
    setEnvironments(
      environments.map((e) => (e.id === id ? { ...e, ...updatedFields } : e))
    );
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Top Breadcrumb Navigation */}
      <Breadcrumbs
        items={[
          { label: "Home", path: "/dashboard" },
          { label: "Storyboarder" },
        ]}
      />

      {/* Main Premium Page Header & Wizard Progress */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center w-full pb-8 border-b border-outline-variant/10 gap-6">
        <div className="flex flex-col">
          <h1 className="text-4xl font-headline font-bold text-white tracking-tight flex items-center gap-3">
            Storyboarder
            {isMockModeRef.current && (
              <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-secondary-container/20 text-secondary border border-secondary/20 font-sans tracking-widest uppercase font-semibold">
                Simulated AI Node
              </span>
            )}
          </h1>
          <p className="text-sm text-secondary tracking-widest uppercase font-medium mt-1">
            Phase: {currentStep === 1 ? "Narrative Synthesis" : currentStep === 2 ? "Asset Verification" : "Cinematic Generation"}
          </p>
        </div>

        {/* Reactive Wizard Stepper */}
        <div className="flex items-center gap-4 bg-surface-container-low/40 border border-outline-variant/10 rounded-2xl p-3 backdrop-blur-sm self-stretch md:self-auto">
          {/* Step 1 indicator */}
          <button
            onClick={() => currentStep > 1 && setCurrentStep(1)}
            disabled={currentStep === 3}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${currentStep === 1
              ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(221,183,255,0.3)]"
              : "text-on-surface-variant/60 hover:text-white"
              }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep > 1 ? "bg-green-500 text-white" : "border border-current"
              }`}>
              {currentStep > 1 ? "✓" : "1"}
            </span>
            <span className="text-xs font-headline font-semibold">Configure</span>
          </button>

          <div className="w-6 h-[1px] bg-outline-variant/20"></div>

          {/* Step 2 indicator */}
          <button
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            disabled={currentStep === 1 || currentStep === 3}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${currentStep === 2
              ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(221,183,255,0.3)]"
              : "text-on-surface-variant/60"
              }`}
          >
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${currentStep > 2 ? "bg-green-500 text-white" : "border border-current"
              }`}>
              {currentStep > 2 ? "✓" : "2"}
            </span>
            <span className="text-xs font-headline font-semibold">Verify</span>
          </button>

          <div className="w-6 h-[1px] bg-outline-variant/20"></div>

          {/* Step 3 indicator */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl transition-all ${currentStep === 3
              ? "bg-primary text-on-primary font-bold shadow-[0_0_15px_rgba(221,183,255,0.3)]"
              : "text-on-surface-variant/40"
              }`}
          >
            <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs font-headline font-semibold">
              3
            </span>
            <span className="text-xs font-headline font-semibold">Generate</span>
          </div>
        </div>
      </header>

      {/* ========================================================================= */}
      {/* 🟢 STEP 1 VIEW: NARRATIVE CONFIGURATION */}
      {/* ========================================================================= */}
      {currentStep === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animation-fade-in">
          {/* Main prompt input panel */}
          <div className="lg:col-span-8 space-y-6">
            <div className="glass-panel p-8 rounded-3xl bg-surface-container/30 border border-outline-variant/10 shadow-2xl backdrop-blur-2xl">
              <label className="block text-sm font-bold text-secondary uppercase tracking-widest mb-4">
                Story Narrative Prompt
              </label>

              <textarea
                value={mainPrompt}
                onChange={(e) => setMainPrompt(e.target.value)}
                className="w-full h-72 bg-surface-container-lowest/40 border border-outline-variant/10 rounded-2xl text-lg text-on-surface placeholder:text-on-surface-variant/30 focus:ring-2 focus:ring-secondary/20 focus:border-secondary/40 transition-all resize-none p-6 font-light shadow-inner"
                placeholder="Describe the core narrative arc... e.g., A detective in a neo-Tokyo setting discovers a glitch in reality."
              />

              <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-t border-outline-variant/10 pt-6">
                {/* Stepper with check option */}
                <div className="flex items-center gap-6">
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={enableEpisodes}
                      onChange={(e) => setEnableEpisodes(e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    <span className="ms-3 text-sm font-medium text-on-surface">Enable Episodes</span>
                  </label>

                  <div className={`flex items-center bg-surface-container-high rounded-xl px-4 py-1.5 border border-outline-variant/10 transition-opacity ${enableEpisodes ? "opacity-100" : "opacity-40 pointer-events-none"
                    }`}>
                    <button
                      onClick={() => setEpisodeCount(Math.max(1, episodeCount - 1))}
                      className="text-secondary hover:text-white text-lg font-bold p-1 w-6 h-6 flex items-center justify-center transition-colors"
                    >
                      -
                    </button>
                    <span className="mx-4 font-display font-bold text-white tracking-widest">
                      {episodeCount.toString().padStart(2, "0")}
                    </span>
                    <button
                      onClick={() => setEpisodeCount(Math.min(10, episodeCount + 1))}
                      className="text-secondary hover:text-white text-lg font-bold p-1 w-6 h-6 flex items-center justify-center transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Strategy Choice */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] text-on-surface-variant uppercase font-bold tracking-widest">
                    Split Strategy
                  </label>
                  <select
                    value={splitStrategy}
                    onChange={(e) => setSplitStrategy(e.target.value)}
                    className="bg-surface-container-high border border-outline-variant/10 rounded-xl text-sm focus:ring-primary/20 focus:border-primary/40 text-on-surface py-2.5 pl-4 pr-10 font-semibold"
                  >
                    <option>Continuous Arc</option>
                    <option>Anthology</option>
                    <option>Cliffhanger</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Visual specifications sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="glass-panel p-6 rounded-3xl bg-surface-container/30 border border-outline-variant/10 shadow-2xl backdrop-blur-2xl">
              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-6">
                Visual Identity
              </h3>

              {/* Art style Grid selectors */}
              <div className="grid grid-cols-2 gap-3 mb-8">
                {[
                  { id: "Cinematic", icon: "movie" },
                  { id: "Anime", icon: "brush" },
                  { id: "Pixar 3D", icon: "view_in_ar" },
                  { id: "Cyberpunk", icon: "nights_stay" },
                ].map((style) => (
                  <button
                    key={style.id}
                    onClick={() => setArtStyle(style.id)}
                    className={`p-4 rounded-2xl border text-xs font-bold flex flex-col items-center gap-2 transition-all ${artStyle === style.id
                      ? "border-primary bg-primary/10 text-primary shadow-[0_0_15px_rgba(221,183,255,0.15)]"
                      : "border-outline-variant/20 hover:border-secondary/50 text-on-surface-variant hover:text-white bg-surface-container-high/20"
                      }`}
                  >
                    <span className="material-symbols-outlined">{style.icon}</span>
                    {style.id}
                  </button>
                ))}
              </div>

              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest mb-4">
                Aspect Ratio
              </h3>

              {/* Aspect Ratio Buttons */}
              <div className="flex gap-2">
                {["9:16", "16:9", "1:1"].map((ratio) => (
                  <button
                    key={ratio}
                    onClick={() => setAspectPratio(ratio)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-all ${aspectPratio === ratio
                      ? "bg-primary border-primary text-on-primary shadow-[0_0_15px_rgba(221,183,255,0.2)]"
                      : "bg-surface-container-highest/30 border-outline-variant/20 text-on-surface-variant hover:text-white hover:border-outline-variant/50"
                      }`}
                  >
                    {ratio}
                  </button>
                ))}
              </div>
            </div>

            {/* Premium triggers */}
            <button
              onClick={handleNextToStep2}
              className="w-full py-4.5 rounded-2xl bg-gradient-to-r from-primary to-primary-container text-on-primary font-black tracking-widest uppercase hover:scale-[1.02] active:scale-98 transition-all shadow-[0_10px_35px_rgba(120,24,198,0.35)] hover:shadow-[0_12px_40px_rgba(120,24,198,0.5)] border border-primary/20 text-sm"
            >
              Next: Analyze Assets
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔵 STEP 2 VIEW: ASSET VERIFICATION GRID */}
      {/* ========================================================================= */}
      {currentStep === 2 && (
        <div className="space-y-10 animation-fade-in">
          {loadingState === "analyzing" ? (
            /* Analysis Skeletons and Spinners */
            <div className="glass-panel p-16 rounded-3xl text-center space-y-8 bg-surface-container/30 border border-outline-variant/10 shadow-2xl backdrop-blur-2xl">
              <div className="relative w-24 h-24 mx-auto">
                <div className="absolute inset-0 rounded-full border-4 border-primary/20"></div>
                <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
              </div>
              <div className="space-y-3">
                <h3 className="text-2xl font-headline font-bold text-white">Narrative Ingestion Engine Running</h3>
                <p className="text-on-surface-variant/80 max-w-md mx-auto text-sm">
                  Performing lexical analysis on your script prompt. Isolating character identities, structural archetypes, and physical visual locations...
                </p>
              </div>
            </div>
          ) : (
            /* Asset Grid Cards */
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Character Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-3 border-b border-outline-variant/10 pb-4">
                  <span className="text-primary material-symbols-outlined">person</span>
                  Detected Characters
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {characters.map((char) => (
                    <div
                      key={char.id}
                      className={`glass-panel p-5 rounded-2xl flex items-center gap-4 relative group border transition-all ${char.selected
                        ? "border-primary/25 bg-surface-container-high/40"
                        : "border-outline-variant/10 bg-surface-container-low/20 opacity-50"
                        }`}
                    >
                      <input
                        type="checkbox"
                        checked={char.selected}
                        onChange={() => handleToggleCharacterSelection(char.id)}
                        className="absolute top-4 right-4 rounded border-outline-variant/30 bg-transparent text-primary focus:ring-primary/40 cursor-pointer"
                      />

                      <img
                        alt={char.name}
                        className="w-16 h-16 rounded-xl object-cover border border-outline-variant/20 group-hover:scale-105 transition-transform duration-300 shadow-md"
                        src={char.imageUrl}
                      />

                      <div className="flex-1 min-w-0 pr-6">
                        {char.isEditing ? (
                          <div className="space-y-2 mt-1">
                            <input
                              type="text"
                              value={char.name}
                              onChange={(e) => handleEditCharacter(char.id, { name: e.target.value })}
                              className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 rounded-lg text-xs py-1 px-2 text-white font-bold"
                              placeholder="Name"
                            />
                            <input
                              type="text"
                              value={char.role}
                              onChange={(e) => handleEditCharacter(char.id, { role: e.target.value })}
                              className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 rounded-lg text-[10px] py-1 px-2 text-on-surface-variant"
                              placeholder="Role/Archetype"
                            />
                            <button
                              onClick={() => handleEditCharacter(char.id, { isEditing: false })}
                              className="text-[10px] bg-secondary text-on-secondary px-2.5 py-0.5 rounded font-bold hover:scale-105 transition-all"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <>
                            <h4 className="font-bold text-white truncate">{char.name}</h4>
                            <span className="inline-block mt-1 px-2.5 py-0.5 rounded text-[9px] bg-secondary-container/20 text-secondary border border-secondary/20 uppercase tracking-widest font-black">
                              {char.role}
                            </span>
                            <button
                              onClick={() => handleEditCharacter(char.id, { isEditing: true })}
                              className="block text-[10px] text-primary underline mt-2.5 hover:text-white transition-colors"
                            >
                              Edit Prompt
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Environments Column */}
              <div className="space-y-6">
                <h3 className="text-xl font-headline font-bold text-white flex items-center gap-3 border-b border-outline-variant/10 pb-4">
                  <span className="text-secondary material-symbols-outlined">landscape</span>
                  Detected Environments
                </h3>

                <div className="space-y-4">
                  {environments.map((env) => (
                    <div
                      key={env.id}
                      className={`glass-panel rounded-2xl overflow-hidden group border transition-all ${env.selected
                        ? "border-secondary/20 bg-surface-container-high/30"
                        : "border-outline-variant/15 bg-surface-container-low/10 opacity-40"
                        }`}
                    >
                      <div className="h-36 w-full relative overflow-hidden">
                        <img
                          alt={env.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          src={env.imageUrl}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-surface-container-highest to-transparent"></div>

                        <input
                          type="checkbox"
                          checked={env.selected}
                          onChange={() => handleToggleEnvironmentSelection(env.id)}
                          className="absolute top-4 right-4 rounded border-outline-variant/30 bg-transparent text-primary focus:ring-primary/40 cursor-pointer z-10"
                        />
                      </div>

                      <div className="p-5 flex justify-between items-center gap-4">
                        <div className="flex-1 min-w-0">
                          {env.isEditing ? (
                            <div className="space-y-2 mt-1">
                              <input
                                type="text"
                                value={env.name}
                                onChange={(e) => handleEditEnvironment(env.id, { name: e.target.value })}
                                className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 rounded-lg text-xs py-1 px-2 text-white font-bold"
                                placeholder="Environment Name"
                              />
                              <textarea
                                value={env.details}
                                onChange={(e) => handleEditEnvironment(env.id, { details: e.target.value })}
                                className="w-full bg-surface-container-lowest/60 border border-outline-variant/30 rounded-lg text-[10px] py-1 px-2 text-on-surface-variant resize-none"
                                rows={2}
                                placeholder="Visual Detail"
                              />
                              <button
                                onClick={() => handleEditEnvironment(env.id, { isEditing: false })}
                                className="text-[10px] bg-secondary text-on-secondary px-2.5 py-0.5 rounded font-bold hover:scale-105 transition-all"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <>
                              <h4 className="font-bold text-white truncate">{env.name}</h4>
                              <p className="text-xs text-on-surface-variant/80 mt-1 truncate">{env.details}</p>
                            </>
                          )}
                        </div>

                        {!env.isEditing && (
                          <button
                            onClick={() => handleEditEnvironment(env.id, { isEditing: true })}
                            className="text-xs text-primary font-bold border border-primary/20 hover:border-primary bg-primary/5 hover:bg-primary/10 px-3.5 py-1.5 rounded-xl transition-all whitespace-nowrap"
                          >
                            Edit Detail
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Navigation Bar */}
              <div className="lg:col-span-2 flex justify-between items-center pt-8 border-t border-outline-variant/10 mt-8">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-8 py-3.5 rounded-xl border border-outline-variant/30 text-on-surface-variant hover:text-white font-bold hover:bg-surface-container transition-all"
                >
                  Back to Prompt
                </button>

                <button
                  onClick={handleTriggerStoryboardExecution}
                  className="px-10 py-3.5 rounded-xl bg-gradient-to-r from-secondary to-secondary-container text-on-secondary font-black tracking-widest uppercase shadow-lg hover:scale-103 active:scale-97 transition-all border border-secondary/20 text-sm shadow-[0_0_20px_rgba(76,217,246,0.2)]"
                >
                  Generate Complete Storyboard
                </button>
              </div>

            </div>
          )}
        </div>
      )}

      {/* ========================================================================= */}
      {/* 🔴 STEP 3 VIEW: TIMELINE & PROGRESSIVE GRAPHICS GRID */}
      {/* ========================================================================= */}
      {currentStep === 3 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animation-fade-in">

          {/* Left panel: Timeline index status */}
          <div className="lg:col-span-3 space-y-4">

            {/* Dynamic Status Timeline Box */}
            <div className="glass-panel p-6 rounded-3xl bg-surface-container/30 border border-outline-variant/10 shadow-2xl backdrop-blur-2xl">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-6 border-b border-outline-variant/10 pb-3 flex justify-between items-center">
                <span>Episodes Timeline</span>
                {loadingState === "polling" && (
                  <span className="inline-flex w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span>
                )}
              </h4>

              <div className="space-y-8 relative">
                {/* Timeline beam */}
                <div className="absolute left-[11px] top-4 bottom-4 w-[2px] bg-gradient-to-b from-primary via-outline-variant/20 to-transparent"></div>

                {generationStatus?.episodes.map((ep, idx) => {
                  const isCompleted = ep.status === "Completed";
                  const isProcessing = ep.status === "Processing";
                  const isCurrent = idx === activeEpisodeIndex;

                  return (
                    <div
                      key={ep.episodeNumber}
                      onClick={() => setActiveEpisodeIndex(idx)}
                      className={`flex gap-4 items-start relative z-10 cursor-pointer group transition-opacity ${isCompleted || isProcessing ? "opacity-100" : "opacity-45 hover:opacity-75"
                        }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center transition-all ${isCompleted
                        ? "bg-green-500 text-white ring-4 ring-green-500/20"
                        : isProcessing
                          ? "bg-primary text-on-primary ring-4 ring-primary/20 animate-pulse"
                          : "bg-outline-variant text-on-surface-variant"
                        }`}>
                        <span className="material-symbols-outlined text-[14px]">
                          {isCompleted ? "check" : isProcessing ? "play_arrow" : "lock"}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-bold transition-colors ${isCurrent ? "text-secondary" : isProcessing ? "text-primary" : "text-white group-hover:text-secondary"
                          }`}>
                          Episode {ep.episodeNumber}
                        </p>
                        <p className="text-[10px] text-on-surface-variant mt-0.5 truncate">
                          {ep.status === "Completed"
                            ? "All frames generated"
                            : ep.status === "Processing"
                              ? generationStatus.currentStatus
                              : "Waiting in queue"}
                        </p>

                        {isProcessing && (
                          <div className="w-full bg-surface-container-highest h-1 rounded-full overflow-hidden mt-2">
                            <div
                              className="bg-primary h-full transition-all duration-1000 animate-pulse"
                              style={{ width: `${generationStatus.overallProgress}%` }}
                            ></div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rendering statistics module */}
            <div className="glass-panel p-6 rounded-3xl bg-surface-container/30 border border-outline-variant/10 shadow-2xl backdrop-blur-2xl">
              <h4 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">
                Rendering Stats
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-surface-container-low/40 p-3.5 rounded-xl border border-outline-variant/5">
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase">Frames</p>
                  <p className="text-2xl font-headline font-black text-white mt-1">
                    {generationStatus?.episodes.reduce((acc, ep) =>
                      acc + ep.scenes.filter(s => s.imageUrl !== null).length, 0
                    ) || 0} / {(generationStatus?.episodes.length || 1) * 2}
                  </p>
                </div>

                <div className="bg-surface-container-low/40 p-3.5 rounded-xl border border-outline-variant/5">
                  <p className="text-[10px] text-on-surface-variant font-medium uppercase">Progress</p>
                  <p className="text-2xl font-headline font-black text-secondary mt-1">
                    {generationStatus?.overallProgress || 0}%
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Area: Main Render Storyboard Grid */}
          <div className="lg:col-span-9 space-y-6">

            {/* Active Episode Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-surface-container-low/20 p-4 border border-outline-variant/10 rounded-2xl backdrop-blur-sm">
              <div className="flex flex-col">
                <h2 className="text-xl font-headline font-bold text-white flex items-center gap-3">
                  <span className="text-secondary material-symbols-outlined">auto_stories</span>
                  Episode {activeEpisodeIndex + 1}: {
                    activeEpisodeIndex === 0 ? "The Glitch Manifest" :
                      activeEpisodeIndex === 1 ? "Blueprint Rifts" : "Reality Dissolution"
                  }
                </h2>
                {generationJobId && (
                  <span className="text-[10px] text-on-surface-variant font-mono mt-1 block">
                    Job ID: {generationJobId}
                  </span>
                )}
              </div>

              <div className="flex gap-2.5">
                <button
                  disabled={generationStatus?.overallProgress !== 100}
                  className="px-4 py-2 bg-surface-container-high rounded-xl text-xs font-bold flex items-center gap-2 border border-outline-variant/25 text-on-surface hover:bg-surface-variant disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <span className="material-symbols-outlined text-sm">download</span>
                  Export Draft
                </button>

                <button
                  disabled={generationStatus?.overallProgress !== 100}
                  className="px-4 py-2 bg-primary text-on-primary rounded-xl text-xs font-black flex items-center gap-2 disabled:opacity-30 disabled:pointer-events-none hover:scale-[1.03] transition-all shadow-[0_0_15px_rgba(221,183,255,0.2)]"
                >
                  <span className="material-symbols-outlined text-sm">smart_display</span>
                  Preview Story
                </button>
              </div>
            </div>

            {/* Scenes Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {generationStatus?.episodes[activeEpisodeIndex]?.scenes.map((scene, sIdx) => {
                const hasImg = scene.imageUrl !== null;
                const isProcessing = generationStatus.episodes[activeEpisodeIndex].status === "Processing";

                return (
                  <div
                    key={scene.sceneId}
                    className={`glass-panel rounded-3xl overflow-hidden flex flex-col border transition-all ${hasImg
                      ? "border-primary/15 bg-surface-container/30 shadow-xl"
                      : isProcessing
                        ? "border-dashed border-secondary/35 bg-surface-container-low/20"
                        : "border-outline-variant/10 bg-surface-container-lowest/10 opacity-30"
                      }`}
                  >

                    {/* Scene Image Viewport */}
                    <div className="aspect-[9/16] relative overflow-hidden bg-surface-container-lowest/40 flex items-center justify-center">
                      {hasImg ? (
                        <>
                          <img
                            alt={`Scene ${sIdx + 1}`}
                            className="w-full h-full object-cover"
                            src={scene.imageUrl!}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>

                          <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-primary/80 backdrop-blur-md text-on-primary text-[10px] font-black rounded-full shadow-lg uppercase tracking-widest border border-primary/20">
                            SCENE {String(sIdx + 1).padStart(2, "0")}
                          </div>
                        </>
                      ) : isProcessing ? (
                        /* Pulsing Spinner for active render */
                        <div className="flex flex-col items-center gap-5 p-6 text-center">
                          <div className="relative w-14 h-14">
                            <div className="absolute inset-0 rounded-full border-4 border-secondary/20"></div>
                            <div className="absolute inset-0 rounded-full border-4 border-t-secondary animate-spin"></div>
                          </div>
                          <div className="space-y-1.5 animate-pulse">
                            <p className="text-[10px] font-black text-secondary uppercase tracking-widest">
                              Rendering Frame...
                            </p>
                            <p className="text-[9px] text-on-surface-variant">
                              Running prompt vector analysis
                            </p>
                          </div>

                          <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded-full uppercase tracking-widest">
                            SCENE {String(sIdx + 1).padStart(2, "0")}
                          </div>
                        </div>
                      ) : (
                        /* Locked queue image state */
                        <div className="flex flex-col items-center gap-3 text-on-surface-variant/40">
                          <span className="material-symbols-outlined text-4xl">image</span>
                          <span className="text-[9px] uppercase tracking-widest font-black">In Queue</span>

                          <div className="absolute top-4 left-4 px-3.5 py-1.5 bg-surface-container-highest/50 text-on-surface-variant/40 text-[10px] font-bold rounded-full uppercase tracking-widest">
                            SCENE {String(sIdx + 1).padStart(2, "0")}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Scene Metadata & Prompt overlays */}
                    <div className={`p-5 space-y-4 flex-1 flex flex-col justify-between ${hasImg ? "bg-surface-container/20" : isProcessing ? "bg-surface-container-low/10" : "bg-transparent"
                      }`}>
                      {hasImg ? (
                        <div className="space-y-4">
                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-secondary uppercase tracking-widest">
                              Visual Description
                            </label>
                            <p className="text-xs leading-relaxed text-on-surface-variant italic">
                              {scene.description || "Synthesizing vector imagery outlines based on prompt constraints."}
                            </p>
                          </div>

                          <div className="space-y-1">
                            <label className="text-[9px] font-black text-tertiary uppercase tracking-widest">
                              Voiceover Narration
                            </label>
                            <p className="text-xs leading-relaxed text-white font-medium">
                              {scene.narration}
                            </p>
                          </div>
                        </div>
                      ) : isProcessing ? (
                        /* Animated placeholders for descriptive texts */
                        <div className="space-y-3 animate-pulse">
                          <div className="h-3.5 bg-surface-container-highest/60 rounded-lg w-3/4"></div>
                          <div className="h-3.5 bg-surface-container-highest/60 rounded-lg w-1/2"></div>
                          <div className="h-3 bg-surface-container-highest/30 rounded-lg w-5/6"></div>
                        </div>
                      ) : (
                        /* Idle details placeholders */
                        <div className="space-y-2">
                          <div className="h-3 bg-surface-container-highest/20 rounded w-2/3"></div>
                          <div className="h-3 bg-surface-container-highest/20 rounded w-1/2"></div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>
          </div>

          {/* Reset Navigation Trigger */}
          <div className="lg:col-span-12 flex justify-start pt-8 border-t border-outline-variant/10 mt-8">
            <button
              onClick={() => {
                if (pollingIntervalRef.current) {
                  clearInterval(pollingIntervalRef.current);
                }
                setCurrentStep(1);
                setLoadingState("idle");
                setGenerationJobId(null);
                setGenerationStatus(null);
              }}
              className="px-6 py-3 rounded-xl border border-outline-variant/20 hover:border-outline-variant/40 text-on-surface-variant hover:text-white font-bold hover:bg-surface-container transition-all"
            >
              Start New Storyboard
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
