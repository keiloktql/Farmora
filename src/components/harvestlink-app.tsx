"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bookmark,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  CloudRain,
  Compass,
  ExternalLink,
  Eye,
  Filter,
  Globe2,
  Heart,
  Leaf,
  MapPin,
  Menu,
  PackageCheck,
  PackageSearch,
  Plus,
  Search,
  Send,
  ShieldCheck,
  SlidersHorizontal,
  Sparkles,
  Star,
  Sprout,
  Truck,
  Users,
  Warehouse,
  X,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Map as MapCN, MapControls, MapMarker, MarkerContent, MarkerTooltip, MapRoute, RouteProgress, RouteMarker } from "@/components/ui/map";

type View = "marketplace" | "network" | "forecasts" | "shipments";
type AccountRole = "farmer" | "fpo" | "buyer";
const viewPaths: Record<View, string> = { marketplace: "/marketplace", network: "/network", forecasts: "/forecasts", shipments: "/shipments" };
const pathViews: Record<string, View> = { "/": "marketplace", "/marketplace": "marketplace", "/network": "network", "/forecasts": "forecasts", "/shipments": "shipments" };
type SupplyLot = {
  id: string;
  crop: string;
  variety: string;
  producer: string;
  location: string;
  quantity: string;
  grade: string;
  harvest: string;
  price: string;
  icon: string;
  tone: string;
  verified: boolean;
};

const initialLots: SupplyLot[] = [
  { id: "HL-2841", crop: "Mango", variety: "Banganapalle", producer: "Kaveri Farmers Collective", location: "Chittoor, Andhra Pradesh", quantity: "12.4 tonnes", grade: "Export grade A", harvest: "Ready now", price: "₹68 / kg", icon: "🥭", tone: "mango", verified: true },
  { id: "HL-2838", crop: "Grapes", variety: "Thompson Seedless", producer: "Sahyadri Farms Network", location: "Nashik, Maharashtra", quantity: "8.0 tonnes", grade: "Residue tested", harvest: "Harvesting 22 Nov", price: "₹92 / kg", icon: "🍇", tone: "grape", verified: true },
  { id: "HL-2833", crop: "Turmeric", variety: "Salem finger", producer: "Erode Agro Producer Co.", location: "Erode, Tamil Nadu", quantity: "5.6 tonnes", grade: "Organic in conversion", harvest: "Ready in 4 days", price: "₹144 / kg", icon: "🫚", tone: "turmeric", verified: false },
  { id: "HL-2829", crop: "Green chilli", variety: "Byadgi", producer: "Malnad Horticulture FPO", location: "Haveri, Karnataka", quantity: "3.2 tonnes", grade: "Quality checked", harvest: "Ready now", price: "₹76 / kg", icon: "🌶️", tone: "chilli", verified: true },
];

const producerProfiles = [
  { name: "Kaveri Farmers Collective", type: "Farmer Producer Company", region: "Chittoor, Andhra Pradesh", members: "348 farmer members", crops: "Mango · Groundnut · Tomato", reliability: "96% order fulfilment", verified: true, initials: "KF", color: "avocado", rating: "4.8", reviews: 26 },
  { name: "Sahyadri Farms Network", type: "FPO & exporter", region: "Nashik, Maharashtra", members: "1,200+ farmer members", crops: "Grapes · Pomegranate · Vegetables", reliability: "Export ready", verified: true, initials: "SF", color: "plum", rating: "4.9", reviews: 41 },
  { name: "Erode Agro Producer Co.", type: "Farmer Producer Company", region: "Erode, Tamil Nadu", members: "512 farmer members", crops: "Turmeric · Coconut · Banana", reliability: "Member since 2022", verified: false, initials: "EA", color: "gold", rating: "4.5", reviews: 12 },
];

const roleDetails: Record<AccountRole, { label: string; subtitle: string; initials: string; name: string; home: string; description: string; cta: string }> = {
  farmer: { label: "Farmer", subtitle: "Individual grower", initials: "RS", name: "Ravi Singh", home: "Your harvest, connected", description: "Share your harvest window, compare buyer demand, and follow each order from pickup to payment.", cta: "List your harvest" },
  fpo: { label: "FPO", subtitle: "Producer organisation", initials: "KF", name: "Anita Sharma", home: "Good morning, Anita", description: "Bring member harvests together, plan reliable volumes, and fulfil buyer orders as one group.", cta: "Post a supply lot" },
  buyer: { label: "Buyer", subtitle: "Retailer or importer", initials: "LC", name: "Lena Chen", home: "Source with confidence", description: "Compare available produce, share a sourcing request, and track incoming orders in one place.", cta: "Post a buyer request" },
};

const shipments = [
  { id: "SH-2026-184", crop: "Banganapalle mangoes", from: "Chittoor, India", to: "Singapore", qty: "2,000 kg", eta: "28 Nov, 10:30 AM", step: 2, status: "In transit", carrier: "Maersk · MSKU 482019-4" },
  { id: "SH-2026-179", crop: "Thompson grapes", from: "Nashik, India", to: "Singapore", qty: "4,800 kg", eta: "30 Nov, 4:00 PM", step: 1, status: "At packhouse", carrier: "Booking confirmed · Vessel: Lotus" },
  { id: "SH-2026-171", crop: "Salem turmeric", from: "Erode, India", to: "Singapore", qty: "1,200 kg", eta: "02 Dec, 8:00 AM", step: 0, status: "Quality clearance", carrier: "Documents being prepared" },
];

const shipmentCoordinates: [number, number][] = [
  [79.1, 13.2], [80.27, 13.08], [83, 12.4], [86, 11], [89, 9.4], [92, 7.5], [95, 5.6], [98, 3.6], [101, 1.9], [103.82, 1.27],
];

const viewTitles: Record<View, { title: string; eyebrow: string; description: string }> = {
  marketplace: { title: "Good morning, Anita", eyebrow: "HARVESTLINK EXCHANGE", description: "Find trusted supply, meet buyers, and move produce with confidence." },
  network: { title: "Your trade network", eyebrow: "PEOPLE & ORGANISATIONS", description: "Discover producer groups, exporters, importers, and service partners." },
  forecasts: { title: "Plan with the season", eyebrow: "WEATHER & SUPPLY OUTLOOK", description: "Regional weather signals paired with expected harvest windows." },
  shipments: { title: "Move every lot", eyebrow: "LOGISTICS DESK", description: "Track produce from collection centre to buyer delivery." },
};

function StatusPill({ children, tone = "green" }: { children: ReactNode; tone?: "green" | "amber" | "blue" | "gray" }) {
  return <span className={`status-pill status-${tone}`}><span className="status-dot" />{children}</span>;
}

function SectionHeading({ title, detail, action }: { title: string; detail?: string; action?: ReactNode }) {
  return <div className="section-heading"><div><h2>{title}</h2>{detail && <p>{detail}</p>}</div>{action}</div>;
}

export default function Home({ initialView = "marketplace" }: { initialView?: View }) {
  const router = useRouter();
  const pathname = usePathname();
  const [view, setViewState] = useState<View>(initialView);
  function setView(nextView: View) {
    setViewState(nextView);
    const destination = viewPaths[nextView];
    if (pathname !== destination) router.push(destination);
  }
  useEffect(() => {
    setViewState(pathViews[pathname] ?? initialView);
  }, [pathname, initialView]);
  useEffect(() => {
    const savedRole = window.localStorage.getItem("harvestlink-role");
    const savedWorkspace = window.localStorage.getItem("harvestlink-workspace");
    if (savedRole === "farmer" || savedRole === "fpo" || savedRole === "buyer") setRole(savedRole);
    if (savedWorkspace) { setWorkspaceName(savedWorkspace); setWorkspaceReady(true); }
  }, []);
  const [lots, setLots] = useState(initialLots);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All produce");
  const [selectedShipment, setSelectedShipment] = useState(0);
  const [showLotForm, setShowLotForm] = useState(false);
  const [lotAdded, setLotAdded] = useState(false);
  const [savedLots, setSavedLots] = useState<string[]>([]);
  const [company, setCompany] = useState<(typeof producerProfiles)[number] | null>(null);
  const [role, setRole] = useState<AccountRole>("fpo");
  const [showRoleSetup, setShowRoleSetup] = useState(false);
  const [draftRole, setDraftRole] = useState<AccountRole>("fpo");
  const [workspaceName, setWorkspaceName] = useState("");
  const [workspaceReady, setWorkspaceReady] = useState(false);
  const heading = viewTitles[view];
  const roleInfo = roleDetails[role];
  const currentHeading = view === "marketplace" ? { ...viewTitles.marketplace, title: roleInfo.home } : heading;

  const filteredLots = useMemo(() => lots.filter((lot) => {
    const matchesQuery = `${lot.crop} ${lot.variety} ${lot.producer} ${lot.location}`.toLowerCase().includes(query.toLowerCase());
    const matchesCategory = category === "All produce" || lot.crop.toLowerCase().includes(category.toLowerCase());
    return matchesQuery && matchesCategory;
  }), [lots, query, category]);

  function postLot(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (role === "buyer") {
      setLotAdded(true);
      setShowLotForm(false);
      return;
    }
    const crop = String(form.get("crop") || "Mango");
    const quantity = String(form.get("quantity") || "2.0");
    const newLot: SupplyLot = {
      id: `HL-${Math.floor(2850 + Math.random() * 100)}`,
      crop,
      variety: String(form.get("variety") || "Fresh harvest"),
      producer: "Rampur Mango FPO",
      location: "Chittoor, Andhra Pradesh",
      quantity: `${quantity} tonnes`,
      grade: "Verification in progress",
      harvest: "Ready in 3 days",
      price: "Price on request",
      icon: crop.toLowerCase().includes("mango") ? "🥭" : crop.toLowerCase().includes("grape") ? "🍇" : "🌿",
      tone: "mango",
      verified: false,
    };
    setLots((current) => [newLot, ...current]);
    setLotAdded(true);
    setShowLotForm(false);
    setCategory("All produce");
    setQuery("");
  }

  function toggleSaved(id: string) {
    setSavedLots((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  }

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="brand-lockup">
          <div className="brand-mark"><Leaf size={19} strokeWidth={2.4} /></div>
          <div><div className="brand-name">HarvestLink</div><div className="brand-caption">TRADE, ROOTED IN TRUST</div></div>
        </div>
        <button className="workspace-switch" onClick={() => { setDraftRole(role); setWorkspaceName(""); setShowRoleSetup(true); }} aria-label="Switch or set up account"><span className="workspace-avatar">{roleInfo.initials}</span><span><strong>{workspaceReady && workspaceName ? workspaceName : role === "fpo" ? "Kaveri Collective" : roleInfo.name}</strong><small>{roleInfo.label} workspace · Switch</small></span><ChevronDown size={15} /></button>
        <div className="nav-label">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          <NavButton active={view === "marketplace"} icon={<Compass size={17} />} label="Marketplace" onClick={() => setView("marketplace")} />
          <NavButton active={view === "network"} icon={<Building2 size={17} />} label="Trade network" onClick={() => setView("network")} />
          <NavButton active={view === "forecasts"} icon={<CloudRain size={17} />} label="Weather & harvest" onClick={() => setView("forecasts")} />
          <NavButton active={view === "shipments"} icon={<Truck size={17} />} label="Shipments" count="3" onClick={() => setView("shipments")} />
        </nav>
        <div className="nav-label nav-label-spaced">YOUR BUSINESS</div>
        <nav className="side-nav">
          <NavButton icon={<Warehouse size={17} />} label={role === "farmer" ? "My harvests" : role === "buyer" ? "Saved supply" : "My supply lots"} onClick={() => setView("marketplace")} />
          <NavButton icon={<Users size={17} />} label={role === "buyer" ? "Buyer profile" : role === "farmer" ? "Grower profile" : "Company profile"} onClick={() => { setView("network"); setCompany(producerProfiles[0]); }} />
        </nav>
        <div className="sidebar-bottom">
          <div className="season-card"><div className="season-icon"><Sprout size={17} /></div><div><strong>Rabi season</strong><span>Season outlook available</span></div><ArrowUpRight size={15} /></div>
          <div className="sidebar-user"><div className="user-avatar">{roleInfo.initials}</div><div><strong>{roleInfo.name}</strong><small>{roleInfo.subtitle}</small></div><ChevronDown size={15} /></div>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="breadcrumb"><span>India</span><ChevronRight size={13} /><span className="breadcrumb-current">{view === "marketplace" ? "Exchange" : heading.eyebrow.toLowerCase()}</span></div>
          <div className="topbar-actions"><div className="network-live"><span />Network live</div><div className="topbar-avatar">{roleInfo.initials}</div></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading-row">
          <div><div className="eyebrow">{currentHeading.eyebrow}</div><h1>{currentHeading.title}</h1><p>{view === "marketplace" ? roleInfo.description : currentHeading.description}</p></div>
            <div className="page-actions"><button className="button-quiet" onClick={() => setView("shipments")}><Truck size={16} /> Track shipment</button><Button className="primary-button" onClick={() => { setShowLotForm(true); setLotAdded(false); }}><Plus size={16} /> {roleInfo.cta}</Button></div>
          </div>

          {lotAdded && <div className="success-banner"><CheckCircle2 size={17} /><span>{role === "buyer" ? "Your sourcing request has been shared with the network." : "Your supply lot is live in the exchange."}</span><button onClick={() => setLotAdded(false)} aria-label="Dismiss"><X size={15} /></button></div>}

          {view === "marketplace" && <MarketplaceView role={role} lots={filteredLots} query={query} setQuery={setQuery} category={category} setCategory={setCategory} setView={setView} setCompany={setCompany} savedLots={savedLots} toggleSaved={toggleSaved} onOpenLotForm={() => { setShowLotForm(true); setLotAdded(false); }} />}
          {view === "network" && <NetworkView setCompany={setCompany} />}
          {view === "forecasts" && <ForecastView />}
          {view === "shipments" && <ShipmentView selectedShipment={selectedShipment} setSelectedShipment={setSelectedShipment} />}
        </div>
        <footer className="page-footer"><span>HarvestLink concept prototype</span><span>Sample listings, forecasts, and shipment locations for demonstration</span></footer>
      </main>

      {showLotForm && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowLotForm(false); }}><div className="lot-modal" role="dialog" aria-modal="true" aria-labelledby="lot-title"><div className="modal-heading"><div><div className="eyebrow">ADD TO THE EXCHANGE</div><h2 id="lot-title">{role === "buyer" ? "Post a sourcing request" : role === "farmer" ? "List your harvest" : "Post a supply lot"}</h2><p>{role === "buyer" ? "Tell producer groups what you need and when." : "Share a harvest with buyers across the network."}</p></div><button className="icon-button" onClick={() => setShowLotForm(false)} aria-label="Close"><X size={17} /></button></div><form onSubmit={postLot} className="lot-form"><label>{role === "buyer" ? "Produce needed" : "Produce"}<input name="crop" defaultValue="Mango" required /></label><label>{role === "buyer" ? "Preferred variety or specification" : "Variety"}<input name="variety" defaultValue="Banganapalle" required /></label><label>{role === "buyer" ? "Target quantity (tonnes)" : "Available quantity (tonnes)"}<input name="quantity" type="number" step="0.1" defaultValue="2.0" required /></label><div className="form-note"><ShieldCheck size={16} /><span>{role === "buyer" ? "Your request will be visible to matching producer groups." : "Quality and compliance details can be added after the lot is created."}</span></div><div className="modal-actions"><Button type="button" variant="outline" onClick={() => setShowLotForm(false)}>Cancel</Button><Button type="submit" className="primary-button"><Plus size={15} /> {role === "buyer" ? "Share request" : "Publish lot"}</Button></div></form></div></div>}

      {company && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setCompany(null); }}><CompanyProfile company={company} onClose={() => setCompany(null)} /></div>}
      {showRoleSetup && <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowRoleSetup(false); }}><div className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title"><div className="modal-heading"><div><div className="eyebrow">HARVESTLINK ACCOUNT</div><h2 id="account-title">Set up your workspace</h2><p>Choose how you participate in the produce network. You can switch roles later.</p></div><button className="icon-button" onClick={() => setShowRoleSetup(false)} aria-label="Close"><X size={17} /></button></div><div className="role-choice-grid">{(["farmer", "fpo", "buyer"] as AccountRole[]).map((item) => <button key={item} className={`role-choice ${draftRole === item ? "selected" : ""}`} onClick={() => setDraftRole(item)}><span className="role-choice-icon">{item === "farmer" ? <Sprout size={19} /> : item === "fpo" ? <Users size={19} /> : <Building2 size={19} />}</span><strong>{roleDetails[item].label}</strong><small>{item === "farmer" ? "List your crop, share harvest updates, and reach buyers or a local FPO." : item === "fpo" ? "Aggregate member supply, coordinate quality, and fulfil larger orders." : "Discover supply, post demand, and manage sourcing and shipments."}</small><i>{draftRole === item ? <CheckCircle2 size={16} /> : <span />}</i></button>)}</div><label className="workspace-name-field">{draftRole === "farmer" ? "Your name" : draftRole === "fpo" ? "FPO / organisation name" : "Business name"}<input value={workspaceName} onChange={(event) => setWorkspaceName(event.target.value)} placeholder={draftRole === "farmer" ? "e.g. Ravi Singh" : draftRole === "fpo" ? "e.g. Kaveri Farmers Collective" : "e.g. LionCity Fresh Imports"} /></label><div className="account-flow-note"><ShieldCheck size={16} /><span>Next: add your location and crops or sourcing needs. Verification can be completed when you are ready to trade.</span></div><div className="modal-actions"><Button type="button" variant="outline" onClick={() => setShowRoleSetup(false)}>Cancel</Button><Button className="primary-button" onClick={() => { setRole(draftRole); setWorkspaceReady(true); window.localStorage.setItem("harvestlink-role", draftRole); window.localStorage.setItem("harvestlink-workspace", workspaceName); setShowRoleSetup(false); setView("marketplace"); }}>Continue as {roleDetails[draftRole].label}<ArrowRight size={15} /></Button></div></div></div>}
    </div>
  );
}

function NavButton({ active = false, icon, label, count, onClick }: { active?: boolean; icon: ReactNode; label: string; count?: string; onClick?: () => void }) {
  return <button onClick={onClick} className={`nav-item ${active ? "nav-item-active" : ""}`}>{icon}<span>{label}</span>{count && <em>{count}</em>}</button>;
}

function MarketplaceView({ role, lots, query, setQuery, category, setCategory, setView, setCompany, savedLots, toggleSaved, onOpenLotForm }: {
  role: AccountRole; lots: SupplyLot[]; query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; setView: (value: View) => void; setCompany: (value: (typeof producerProfiles)[number]) => void; savedLots: string[]; toggleSaved: (id: string) => void; onOpenLotForm: () => void;
}) {
  const [tab, setTab] = useState("Supply lots");
  const [activeStep, setActiveStep] = useState(0);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [readyOnly, setReadyOnly] = useState(false);
  const [maxPrice, setMaxPrice] = useState(180);
  const categories = ["All produce", "Mango", "Grapes", "Turmeric", "Green chilli"];
  const flows: Record<AccountRole, { title: string; steps: { label: string; hint: string }[] }> = {
    farmer: { title: "Farmer selling flow", steps: [{ label: "List a harvest", hint: "Add crop, quantity and date" }, { label: "Review buyer demand", hint: "Match with open requests" }, { label: "Follow delivery", hint: "Track pickup to destination" }] },
    fpo: { title: "FPO fulfilment flow", steps: [{ label: "Check member outlook", hint: "Review field and weather updates" }, { label: "Combine a supply lot", hint: "Publish pooled availability" }, { label: "Manage shipment", hint: "Follow export milestones" }] },
    buyer: { title: "Buyer sourcing flow", steps: [{ label: "Set buying requirements", hint: "Share crop and volume needed" }, { label: "Compare suppliers", hint: "Review supply and partner records" }, { label: "Track an order", hint: "Follow arrival to Singapore" }] },
  };
  const flow = flows[role];
  const visibleLots = lots.filter((lot) => {
    const price = Number(lot.price.match(/[0-9]+/)?.[0] ?? 0);
    return (!verifiedOnly || lot.verified) && (!readyOnly || lot.harvest.toLowerCase().includes("now")) && (price === 0 || price <= maxPrice);
  });
  function runStep(index: number) {
    setActiveStep(index);
    if (role === "farmer") {
      if (index === 0) onOpenLotForm();
      if (index === 1) setTab("Buyer requests");
      if (index === 2) setView("shipments");
    } else if (role === "fpo") {
      if (index === 0) setView("forecasts");
      if (index === 1) onOpenLotForm();
      if (index === 2) setView("shipments");
    } else {
      if (index === 0) onOpenLotForm();
      if (index === 1) { setTab("Supply lots"); document.getElementById("supply-listing")?.scrollIntoView({ behavior: "smooth" }); }
      if (index === 2) setView("shipments");
    }
  }
  return <div className="marketplace-page">
    <section className="role-demo-flow" aria-label={`${roleInfoFor(role).label} demo flow`}>
      <div className="role-flow-heading"><div><span className="eyebrow">DEMO FLOW · {roleInfoFor(role).label.toUpperCase()}</span><h2>{flow.title}</h2></div><span className="flow-account"><span className="flow-account-dot" /> {roleInfoFor(role).subtitle}</span></div>
      <div className="role-flow-steps">{flow.steps.map((step, index) => <button key={step.label} className={`role-flow-step ${activeStep === index ? "active" : ""}`} onClick={() => runStep(index)}><span className="flow-step-number">{index + 1}</span><span className="flow-step-copy"><b>{step.label}</b><small>{step.hint}</small></span><ArrowRight size={15} /></button>)}</div>
    </section>

    <div className="shop-category-row" aria-label="Produce categories">{categories.map((item) => <button key={item} className={`shop-category ${category === item ? "selected" : ""}`} onClick={() => setCategory(item)}>{item === "All produce" ? <PackageSearch size={15} /> : <span className={`category-dot category-${item.toLowerCase().replaceAll(" ", "-")}`} />}{item}</button>)}</div>

    <div className="shop-layout" id="supply-section">
      <aside className="shop-filter-panel">
        <div className="shop-filter-heading"><h2>Filter supply</h2><button onClick={() => { setVerifiedOnly(false); setReadyOnly(false); setMaxPrice(180); setCategory("All produce"); }}>Reset</button></div>
        <div className="shop-filter-block"><h3>Price per kg</h3><div className="price-range-labels"><span>₹0</span><b>Up to ₹{maxPrice}</b><span>₹180+</span></div><input className="price-slider" aria-label="Maximum price per kilogram" type="range" min="20" max="180" step="4" value={maxPrice} onChange={(event) => setMaxPrice(Number(event.target.value))} /></div>
        <div className="shop-filter-block"><h3>Availability</h3><label className="filter-check"><input type="checkbox" checked={readyOnly} onChange={(event) => setReadyOnly(event.target.checked)} /> Ready to dispatch <span>Now</span></label><label className="filter-check"><input type="checkbox" checked={verifiedOnly} onChange={(event) => setVerifiedOnly(event.target.checked)} /> Traceable / checked <span>{lots.filter((lot) => lot.verified).length}</span></label></div>
        <div className="shop-filter-block"><h3>Supply region</h3><button className="region-filter" onClick={() => setQuery(query.includes("Andhra") ? "" : "Andhra") }><MapPin size={14} /> Andhra Pradesh <span>⌄</span></button><button className="region-filter" onClick={() => setQuery(query.includes("Maharashtra") ? "" : "Maharashtra")}><MapPin size={14} /> Maharashtra <span>⌄</span></button></div>
        <div className="weather-filter-note"><CloudRain size={15} /><span><b>Harvest outlook</b><small>Chittoor supply is on track this week.</small><button onClick={() => setView("forecasts")}>View weather notes <ArrowRight size={12} /></button></span></div>
      </aside>

      <section className="shop-results" id="supply-listing">
        <div className="shop-search-row"><div className="search-field"><Search size={17} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search produce, variety, or supplier" /></div><button className="sort-select" onClick={() => setCategory("All produce")}><SlidersHorizontal size={15} /> Sort: recently listed <ChevronDown size={14} /></button></div>
        <div className="shop-results-heading"><div className="tab-row"><button onClick={() => setTab("Supply lots")} className={tab === "Supply lots" ? "market-tab active" : "market-tab"}>Available supply <span>{visibleLots.length}</span></button><button onClick={() => setTab("Buyer requests")} className={tab === "Buyer requests" ? "market-tab active" : "market-tab"}>Buyer requests <span>24</span></button></div><span className="results-note">Sample listings · India</span></div>
        {tab === "Supply lots" ? <div className="lots-grid shop-products">{visibleLots.map((lot) => <LotCard key={lot.id} lot={lot} onProducer={() => { const profile = producerProfiles.find((item) => lot.producer.includes(item.name.split(" ")[0])); if (profile) setCompany(profile); else setView("network"); }} saved={savedLots.includes(lot.id)} onSave={() => toggleSaved(lot.id)} />)}{visibleLots.length === 0 && <div className="empty-state"><PackageSearch size={24} /><strong>No matching supply</strong><span>Adjust the crop, price, or availability filters.</span></div>}</div> : <BuyerRequests />}
      </section>
    </div>
  </div>;
}

function roleInfoFor(role: AccountRole) {
  return roleDetails[role];
}

function Stat({ icon, label, value, sub, color }: { icon: ReactNode; label: string; value: string; sub: string; color: string }) {
  return <Card className="stat-card"><div className={`stat-icon stat-${color}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><ArrowUpRight className="stat-arrow" size={15} /></Card>;
}

function LotCard({ lot, onProducer, saved, onSave }: { lot: SupplyLot; onProducer: () => void; saved: boolean; onSave: () => void }) {
  const photo = lot.tone === "mango"
    ? "https://www.icipe.org/sites/default/files/styles/node_gallery_display/public/node_gallery/mangos.jpg?itok=jrFisShD"
    : lot.tone === "grape"
      ? "https://images.unsplash.com/photo-1537640538966-79f369143f8f?auto=format&fit=crop&w=900&q=82"
      : lot.tone === "turmeric"
        ? "https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=900&q=82"
        : "https://images.unsplash.com/photo-1565685110871-1324fc462c84?auto=format&fit=crop&w=900&q=82";
  const profile = producerProfiles.find((item) => lot.producer.includes(item.name.split(" ")[0]));
  return <Card className="lot-card shop-product-card"><div className={`lot-image product-photo lot-${lot.tone}`} role="img" aria-label={`${lot.crop} produce photo`} style={{ backgroundImage: `linear-gradient(180deg, #15251b18 0%, transparent 45%, #15251b08 100%), url("${photo}")` }}><div className="lot-image-top"><Badge className={lot.verified ? "lot-verified" : "lot-pending"}>{lot.verified ? <><CheckCircle2 size={12} /> Verified lot</> : <><Eye size={12} /> Check pending</>}</Badge><button className={`save-button ${saved ? "saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove saved lot" : "Save lot"}><Heart size={16} fill={saved ? "currentColor" : "none"} /></button></div><span className="lot-id">{lot.id}</span></div><div className="lot-card-body"><div className="lot-title-row"><div><h3>{lot.variety}</h3><span>{lot.crop}</span></div><div className="lot-price-block"><strong className="lot-price">{lot.price}</strong><small>per kg</small></div></div><button className="producer-link" onClick={onProducer}><span className="producer-mini-avatar">{lot.producer.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><span>{lot.producer}</span><ExternalLink size={12} /></button><div className="product-card-facts"><span><MapPin size={13} />{lot.location.split(",")[0]}</span><span><Warehouse size={13} />{lot.quantity}</span></div><div className="product-card-bottom"><span className="product-rating"><Star size={12} fill="currentColor" /> {profile?.rating ?? "New"} <small>({profile?.reviews ?? 0})</small></span><span className="harvest-label"><CalendarDays size={12} />{lot.harvest}</span></div><button className="request-button" onClick={onProducer}>View supply details <ArrowRight size={14} /></button></div></Card>;
}

function WeatherDay({ day, icon, temp }: { day: string; icon: string; temp: string }) { return <div className="weather-day"><span>{day}</span><b>{icon}</b><strong>{temp}</strong></div>; }

function BuyerRequests() {
  return <div className="requests-panel"><SectionHeading title="Buyer requests" detail="Open demand from importers, retailers, and processors" /><div className="request-list">{[
    { crop: "Banganapalle mango", buyer: "LionCity Fresh Imports", qty: "2–5 tonnes", destination: "Singapore", date: "Delivery window · 05–15 Dec", tags: ["Export grade", "Residue report"] },
    { crop: "Thompson grapes", buyer: "Meridian Produce Pte Ltd", qty: "4 tonnes", destination: "Singapore", date: "Delivery window · 28 Nov–04 Dec", tags: ["Packhouse ready", "Traceability"] },
    { crop: "Turmeric fingers", buyer: "EastBridge Foods", qty: "8–12 tonnes", destination: "Singapore", date: "Delivery window · December", tags: ["Moisture ≤ 8%", "Bulk supply"] },
  ].map((request, index) => <Card className="request-card" key={request.crop}><div className="request-number">0{index + 1}</div><div className="request-main"><div className="request-buyer"><span className="buyer-dot" />{request.buyer}<Badge className="verified-mini"><Check size={11} /> Profile checked</Badge></div><h3>{request.crop}</h3><div className="request-when"><MapPin size={13} />{request.destination}<span>·</span><CalendarDays size={13} />{request.date}</div><div className="request-tags">{request.tags.map((tag) => <span key={tag}>{tag}</span>)}</div></div><div className="request-volume"><span>Requested volume</span><strong>{request.qty}</strong><button>Respond to buyer <Send size={13} /></button></div></Card>)}</div></div>;
}

function NetworkView({ setCompany }: { setCompany: (value: (typeof producerProfiles)[number]) => void }) {
  const [query, setQuery] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const results = producerProfiles.filter((profile) => `${profile.name} ${profile.type} ${profile.region} ${profile.crops}`.toLowerCase().includes(query.toLowerCase()) && (!verifiedOnly || profile.verified));
  return <div className="network-view">
    <div className="directory-toolbar"><div className="search-field"><Search size={16} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search organisations, crops, or regions" /></div><button className={`directory-filter ${verifiedOnly ? "active" : ""}`} onClick={() => setVerifiedOnly((value) => !value)}><ShieldCheck size={15} /> Verified only <span>{verifiedOnly ? "On" : "Off"}</span></button></div>
    <div className="directory-heading"><div><h2>Producer organisations</h2><p>Profiles include location, crops, member scale, and trade history.</p></div><span>{results.length} organisations</span></div>
    <div className="partner-list">{results.map((profile) => <Card className="partner-row" key={profile.name}><div className={`partner-mark partner-${profile.color}`}>{profile.initials}</div><div className="partner-main"><div className="partner-title"><h3>{profile.name}</h3><span className={profile.verified ? "partner-verified" : "partner-pending"}>{profile.verified ? <><ShieldCheck size={13} /> Verified</> : "Verification pending"}</span></div><p>{profile.type} <span>·</span> <MapPin size={12} /> {profile.region}</p><div className="partner-crops">{profile.crops.split(" · ").map((crop) => <span key={crop}>{crop}</span>)}</div></div><div className="partner-metrics"><span><strong>{profile.members.split(" ")[0]}</strong><small>members</small></span><span><strong className="partner-rating"><Star size={12} fill="currentColor" /> {profile.rating}</strong><small>{profile.reviews} trade reviews</small></span><span><strong>{profile.reliability}</strong><small>trade record</small></span></div><button className="profile-button" onClick={() => setCompany(profile)}>View profile <ArrowRight size={14} /></button></Card>)}{results.length === 0 && <div className="empty-state"><Building2 size={24} /><strong>No matching organisations</strong><span>Try a different crop, organisation, or region.</span></div>}</div>
    <div className="directory-footnote">Concept demo data · Contact and review actions are illustrative.</div>
  </div>;
}

function ForecastView() {
  const bars = [42, 55, 48, 70, 64, 50, 32, 40, 66, 75, 58, 46];
  return <div className="forecast-view"><div className="forecast-top-grid"><Card className="forecast-summary"><div className="forecast-summary-head"><div><div className="eyebrow">CHITTOOR DISTRICT · MANGO BELT</div><h2>Harvest conditions look steady.</h2><p>Weather outlook for the coming 14 days, paired with member crop updates.</p></div><div className="forecast-weather-icon">☀</div></div><div className="forecast-big-stat"><strong>82%</strong><div><span>Expected supply confidence</span><small>Based on 12 of 16 member updates</small></div><StatusPill tone="green">On track</StatusPill></div><div className="harvest-chart"><div className="chart-axis"><span>3t</span><span>2t</span><span>1t</span><span>0</span></div><div className="chart-bars">{bars.map((height, i) => <div className="chart-column" key={i}><span className={i === 7 ? "chart-bar highlight" : "chart-bar"} style={{ height: `${height}%` }} /><small>{["15", "17", "19", "21", "23", "25", "27", "29", "01", "03", "05", "07"][i]}</small></div>)}</div></div><div className="chart-legend"><span><i className="legend-supply" /> Expected harvest volume</span><span><i className="legend-weather" /> Rain risk period</span><span>Nov–Dec 2026</span></div></Card>
      <Card className="risk-card"><div className="card-title-row"><div><div className="eyebrow">FIELD RISK SIGNALS</div><h3>What to watch</h3></div><button className="icon-button" aria-label="More options"><ChevronDown size={16} /></button></div><div className="risk-item"><div className="risk-icon risk-rain"><CloudRain size={16} /></div><div><strong>Light showers · 23–24 Nov</strong><span>May shift picking at 3 farms by 1–2 days.</span></div><StatusPill tone="amber">Monitor</StatusPill></div><div className="risk-item"><div className="risk-icon risk-heat"><Sparkles size={16} /></div><div><strong>Warm afternoons</strong><span>Plan early-morning harvest and shaded collection.</span></div><StatusPill tone="green">Action ready</StatusPill></div><div className="risk-item"><div className="risk-icon risk-pest"><Eye size={16} /></div><div><strong>Pest reports nearby</strong><span>One field check submitted · awaiting expert review.</span></div><StatusPill tone="blue">Review</StatusPill></div><button className="outline-full">Share field update <Send size={14} /></button></Card></div>
      <div className="forecast-bottom-grid"><Card className="crop-forecast-card"><SectionHeading title="Member crop outlook" detail="Expected harvest shared by the FPO coordinator" action={<button className="text-action">Update estimates <ArrowRight size={14} /></button>} /><div className="forecast-table"><div className="forecast-row forecast-header"><span>Crop / block</span><span>Expected window</span><span>Volume outlook</span><span>Confidence</span></div>{[["Banganapalle mango", "Chittoor · 16 farms", "24–30 Nov", "12.4 t", "82%"],["Groundnut", "Punganur · 9 farms", "02–08 Dec", "7.2 t", "74%"],["Tomato", "Madanapalle · 12 farms", "18–24 Nov", "9.8 t", "88%"]].map((row) => <div className="forecast-row" key={row[0]}><span><strong>{row[0]}</strong><small>{row[1]}</small></span><span>{row[2]}</span><span>{row[3]}</span><span><b className="confidence-value">{row[4]}</b><Progress value={parseInt(row[4])} className="confidence-progress" /></span></div>)}</div></Card><div className="forecast-tip"><div className="tip-icon"><Sparkles size={16} /></div><div><b>How to read this outlook</b><p>Forecasts are planning signals, not guarantees. FPO coordinators combine weather data with farmer updates before confirming volumes to buyers.</p><span>Updated 14 Nov · IMD-style sample outlook</span></div></div></div>
    </div>;
}

function ShipmentView({ selectedShipment, setSelectedShipment }: { selectedShipment: number; setSelectedShipment: (value: number) => void }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All statuses");
  const shipment = shipments[selectedShipment];
  const steps = ["Booked", "Packed", "In transit", "At destination", "Delivered"];
  const visibleShipments = shipments.map((item, index) => ({ item, index })).filter(({ item }) =>
    `${item.id} ${item.crop} ${item.from} ${item.to} ${item.carrier}`.toLowerCase().includes(search.toLowerCase()) &&
    (statusFilter === "All statuses" || item.status.toLowerCase() === statusFilter.toLowerCase())
  );
  return <div className="tracking-console">
    <aside className="tracking-list-panel">
      <div className="tracking-list-heading"><div><div className="eyebrow">SHIPMENT OPERATIONS</div><h2>Tracking list</h2><p>Live view of produce in your supply chain</p></div><span className="tracking-count">{shipments.length}</span></div>
      <div className="tracking-search"><Search size={16} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Search ID, crop, or location" /></div>
      <div className="tracking-filters"><select aria-label="Filter by status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>All statuses</option><option>In transit</option><option>At packhouse</option><option>Quality clearance</option></select><span><CalendarDays size={14} /> Recent shipments <ChevronDown size={13} /></span></div>
      <div className="tracking-results">{visibleShipments.map(({ item, index }) => <button key={item.id} onClick={() => setSelectedShipment(index)} className={`tracking-shipment ${selectedShipment === index ? "selected" : ""}`}><div className="tracking-shipment-top"><span>{item.id}</span><i className={`tracking-status-dot status-${index === 0 ? "moving" : index === 1 ? "packing" : "review"}`} /> <b>{item.status}</b></div><div className="tracking-shipment-row"><div><strong>{item.crop}</strong><small>{item.carrier}</small></div><div className="tracking-eta"><small>{index === 0 ? "ETA" : "TARGET"}</small><strong>{item.eta.split(",")[0]}</strong></div></div><div className="tracking-route-pair"><span><small>ORIGIN</small>{item.from}</span><ArrowRight size={14} /><span><small>DESTINATION</small>{item.to}</span></div><div className="tracking-stepper">{steps.map((step, stepIndex) => <div className={`tracking-step ${stepIndex <= item.step + 1 ? "done" : ""} ${stepIndex === item.step + 1 ? "current" : ""}`} key={step}><i>{stepIndex < item.step + 1 ? <Check size={10} /> : null}</i><small>{step}</small></div>)}</div></button>)}{visibleShipments.length === 0 && <div className="tracking-empty">No shipments match those filters.</div>}</div>
      <div className="tracking-list-footer"><span><span className="tracking-live-dot" /> Demo location feed</span><button onClick={() => { setSearch(""); setStatusFilter("All statuses"); }}>Clear filters</button></div>
    </aside>

    <section className="tracking-map-panel">
      <div className="tracking-map-header"><div><div className="eyebrow">SELECTED SHIPMENT · {shipment.id}</div><h2>{shipment.crop}</h2><p>{shipment.qty} <span>·</span> {shipment.from} <ArrowRight size={13} /> {shipment.to}</p></div><div className="tracking-map-header-status"><i className={`tracking-status-dot status-${selectedShipment === 0 ? "moving" : selectedShipment === 1 ? "packing" : "review"}`} />{shipment.status}</div></div>
      <div className="tracking-map-canvas"><MapCN theme="dark" center={[91.3, 7.2]} zoom={3.3} className="tracking-map"><MapRoute coordinates={shipmentCoordinates} progress={Math.min(0.95, (shipment.step + 1) / 5)} color="#425754" width={5} opacity={1} activeColor="#10bfa7" activeWidth={5} activeOpacity={1} dashArray={[1, 1]}><RouteProgress color="#10bfa7" width={5} opacity={1} dashArray={[1, 1]} /><RouteMarker at="start"><MarkerContent><div className="mapcn-point mapcn-origin">IN</div></MarkerContent><MarkerTooltip>Farm collection · Chittoor, India</MarkerTooltip></RouteMarker><RouteMarker at="progress"><MarkerContent><div className="mapcn-current"><Truck size={14} /></div></MarkerContent><MarkerTooltip>{shipment.status} · Updated 2 hours ago</MarkerTooltip></RouteMarker><RouteMarker at="end"><MarkerContent><div className="mapcn-point mapcn-destination">SG</div></MarkerContent><MarkerTooltip>Buyer delivery · Singapore</MarkerTooltip></RouteMarker></MapRoute><MapMarker longitude={80.27} latitude={13.08}><MarkerContent><div className="mapcn-port">2</div></MarkerContent><MarkerTooltip>Export port · Chennai</MarkerTooltip></MapMarker><MapControls position="top-right" showCompass showFullscreen /></MapCN><div className="mapcn-legends"><span><i className="legend-live" /> Tracked leg</span><span><i className="legend-planned" /> Planned route</span><span><MapPin size={12} /> Chennai port</span></div><div className="mapcn-location-card"><span className="mapcn-location-icon"><Truck size={15} /></span><span><small>LAST REPORTED POSITION</small><b>Bay of Bengal · at sea</b><em>Updated 2 hours ago</em></span></div></div>
      <div className="tracking-map-footer"><span><span className="tracking-live-dot" /> Tracking active</span><span>Route preview · India to Singapore</span><span>Estimated arrival <b>{shipment.eta}</b></span></div>
    </section>
  </div>;
}

function CompanyProfile({ company, onClose }: { company: (typeof producerProfiles)[number]; onClose: () => void }) {
  const [reviews, setReviews] = useState([{ author: "LionCity Fresh Imports", date: "Oct 2026", text: "Clear updates through collection and packing. The delivered grade matched the agreed sample.", rating: 5 }]);
  const [reviewOpen, setReviewOpen] = useState(false);
  function submitReview(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setReviews((current) => [{ author: "Your organisation", date: "Just now", text: String(form.get("review") || "Reliable communication and supply."), rating: Number(form.get("rating") || 5) }, ...current]);
    setReviewOpen(false);
  }
  return <div className="company-modal" role="dialog" aria-modal="true" aria-labelledby="company-title"><button className="profile-close icon-button" onClick={onClose} aria-label="Close profile"><X size={17} /></button><div className={`company-cover cover-${company.color}`}><div className="company-cover-art"><span /><span /><span /></div></div><div className="company-body"><div className="company-logo">{company.initials}</div><div className="company-title-row"><div><h2 id="company-title">{company.name}</h2><p>{company.type} <span>·</span> {company.region}</p></div>{company.verified && <Badge className="profile-verified"><ShieldCheck size={12} /> Identity checked</Badge>}</div><div className="company-rating-summary"><span className="rating-stars"><Star size={15} fill="currentColor" /> {company.rating}</span><b>Trade partner rating</b><span>Based on {company.reviews + reviews.length - 1} reviews</span><button onClick={() => setReviewOpen((open) => !open)}><Plus size={13} /> Write a review</button></div><div className="company-actions"><Button className="primary-button"><Send size={15} /> Contact organisation</Button><Button variant="outline"><Bookmark size={15} /> Save profile</Button></div><Separator className="company-divider" /><div className="company-about"><div><div className="eyebrow">ABOUT THE ORGANISATION</div><p>Farmer-led producer group coordinating harvest planning, quality checks, and market access for member farms. This profile is a sample concept record for the prototype.</p></div><div className="company-sidefacts"><span><Users size={15} />{company.members}</span><span><Leaf size={15} />{company.crops}</span><span><PackageCheck size={15} />{company.reliability}</span></div></div><div className="company-proof"><div><CheckCircle2 size={16} /><span>Organisation details reviewed</span></div><div><PackageCheck size={16} /><span>Supply lots listed</span></div><div><Globe2 size={16} /><span>Export markets: Singapore · UAE</span></div></div><div className="review-section"><div className="review-section-head"><div><div className="eyebrow">PARTNER FEEDBACK</div><h3>Recent trade reviews</h3></div><span>{reviews.length} shown</span></div>{reviewOpen && <form className="review-form" onSubmit={submitReview}><select name="rating" aria-label="Rating"><option value="5">★★★★★ · Excellent</option><option value="4">★★★★☆ · Good</option><option value="3">★★★☆☆ · Okay</option></select><textarea name="review" placeholder="Share how the trade went..." required /><Button type="submit" className="primary-button">Post review</Button></form>}{reviews.map((review, index) => <div className="review-item" key={`${review.author}-${index}`}><div className="review-avatar">{review.author.slice(0, 2).toUpperCase()}</div><div className="review-text"><div><strong>{review.author}</strong><small>{review.date}</small></div><span className="review-stars">{"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}</span><p>{review.text}</p></div></div>)}</div></div></div>;
}
