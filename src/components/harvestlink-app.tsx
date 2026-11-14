"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import type { FormEvent, ReactNode } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Bell,
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

const roleDetails: Record<AccountRole, { label: string; subtitle: string; initials: string; name: string; home: string; cta: string }> = {
  farmer: { label: "Farmer", subtitle: "Individual grower", initials: "RS", name: "Ravi Singh", home: "Your harvest, connected", cta: "List your harvest" },
  fpo: { label: "FPO", subtitle: "Producer organisation", initials: "KF", name: "Anita Sharma", home: "Good morning, Anita", cta: "Post a supply lot" },
  buyer: { label: "Buyer", subtitle: "Retailer or importer", initials: "LC", name: "Lena Chen", home: "Find your next supply", cta: "Post a buyer request" },
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
          <div className="topbar-actions"><div className="network-live"><span />Network live</div><button className="icon-button" aria-label="Notifications"><Bell size={17} /><i /></button><div className="topbar-avatar">AS</div></div>
        </header>

        <div className="content-wrap">
          <div className="page-heading-row">
          <div><div className="eyebrow">{currentHeading.eyebrow}</div><h1>{currentHeading.title}</h1><p>{role === "buyer" && view === "marketplace" ? "Compare trusted producer groups, respond to supply, and build reliable sourcing relationships." : currentHeading.description}</p></div>
            <div className="page-actions"><button className="button-quiet" onClick={() => setView("shipments")}><Truck size={16} /> Track shipment</button><Button className="primary-button" onClick={() => { setShowLotForm(true); setLotAdded(false); }}><Plus size={16} /> {roleInfo.cta}</Button></div>
          </div>

          {lotAdded && <div className="success-banner"><CheckCircle2 size={17} /><span>{role === "buyer" ? "Your sourcing request has been shared with the network." : "Your supply lot is live in the exchange."}</span><button onClick={() => setLotAdded(false)} aria-label="Dismiss"><X size={15} /></button></div>}

          {view === "marketplace" && <MarketplaceView lots={filteredLots} query={query} setQuery={setQuery} category={category} setCategory={setCategory} setView={setView} setCompany={setCompany} savedLots={savedLots} toggleSaved={toggleSaved} />}
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

function MarketplaceView({ lots, query, setQuery, category, setCategory, setView, setCompany, savedLots, toggleSaved }: {
  lots: SupplyLot[]; query: string; setQuery: (value: string) => void; category: string; setCategory: (value: string) => void; setView: (value: View) => void; setCompany: (value: (typeof producerProfiles)[number]) => void; savedLots: string[]; toggleSaved: (id: string) => void;
}) {
  const [tab, setTab] = useState("Supply lots");
  const categories = ["All produce", "Mango", "Grapes", "Turmeric", "Green chilli"];
  return <>
    <section className="stats-row">
      <Stat icon={<PackageSearch size={18} />} label="Live supply lots" value="128" sub="Across 9 crop categories" color="green" />
      <Stat icon={<Building2 size={18} />} label="Buyer requests" value="24" sub="6 match your crop profile" color="blue" />
      <Stat icon={<Truck size={18} />} label="Shipments moving" value="08" sub="3 arriving this week" color="amber" />
      <Stat icon={<ShieldCheck size={18} />} label="Verified partners" value="76" sub="Profiles with checked records" color="plum" />
    </section>

    <div className="market-layout" id="supply-section">
      <section className="market-main">
        <div className="market-tabs"><div className="tab-row"><button onClick={() => setTab("Supply lots")} className={tab === "Supply lots" ? "market-tab active" : "market-tab"}>Supply lots <span>128</span></button><button onClick={() => setTab("Buyer requests")} className={tab === "Buyer requests" ? "market-tab active" : "market-tab"}>Buyer requests <span>24</span></button></div><button className="filter-button"><SlidersHorizontal size={15} /> Filters</button></div>
        {tab === "Supply lots" ? <>
          <div className="market-tools"><div className="search-field"><Search size={16} /><input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search crops, varieties, or producer groups" /></div><div className="category-scroll">{categories.map((item) => <button key={item} className={`category-chip ${category === item ? "selected" : ""}`} onClick={() => setCategory(item)}>{item}</button>)}</div></div>
          <SectionHeading title="Available supply" detail="Fresh lots from producer groups across India" action={<button className="text-action" onClick={() => setView("network")}>View all lots <ArrowRight size={14} /></button>} />
          <div className="lots-grid">{lots.map((lot) => <LotCard key={lot.id} lot={lot} onProducer={() => setView("network")} saved={savedLots.includes(lot.id)} onSave={() => toggleSaved(lot.id)} />)}{lots.length === 0 && <div className="empty-state"><PackageSearch size={24} /><strong>No matching lots</strong><span>Try another crop or producer name.</span></div>}</div>
        </> : <BuyerRequests />}
      </section>

      <aside className="market-aside">
        <Card className="weather-card">
          <div className="card-title-row"><div><div className="eyebrow">SOURCING REGION WATCH</div><h3>Weather & harvest</h3></div><div className="weather-icon"><CloudRain size={18} /></div></div>
          <div className="weather-location"><MapPin size={14} /> Chittoor district, Andhra Pradesh <ChevronDown size={14} /></div>
          <div className="weather-main"><div><strong>31°</strong><span>Partly cloudy</span></div><span className="weather-glyph">⛅</span></div>
          <div className="weather-days"><WeatherDay day="Today" icon="☀" temp="31°" /><WeatherDay day="Fri" icon="☁" temp="29°" /><WeatherDay day="Sat" icon="🌧" temp="26°" /><WeatherDay day="Sun" icon="🌦" temp="27°" /></div>
          <div className="weather-impact"><div className="impact-icon"><Sparkles size={15} /></div><div><b>Harvest outlook: steady</b><span>Light rain may delay picking by 1–2 days for some farms.</span></div></div>
          <button className="card-link" onClick={() => setView("forecasts")}>Open regional outlook <ArrowRight size={14} /></button>
        </Card>

        <Card className="buyer-card">
          <div className="buyer-head"><div><div className="eyebrow">BUYER LOOKING FOR</div><h3>Fresh mangoes</h3></div><div className="buyer-logo">LC</div></div>
          <div className="buyer-org"><span className="buyer-dot" /> LionCity Fresh Imports <Badge className="verified-mini"><Check size={11} /> Buyer</Badge></div>
          <div className="buyer-specs"><div><span>Volume</span><b>2–5 tonnes</b></div><div><span>Delivery</span><b>Singapore · Dec</b></div><div><span>Required</span><b>Export grade</b></div></div>
          <button className="outline-full" onClick={() => setTab("Buyer requests")}>See buyer request <ArrowRight size={14} /></button>
        </Card>

        <div className="shipment-mini" onClick={() => setView("shipments")} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && setView("shipments")}>
          <div className="shipment-mini-top"><div className="shipment-mini-icon"><Truck size={16} /></div><span>SHIPMENT TRACKING</span><ArrowUpRight size={15} /></div>
          <strong>SH-2026-184 <span>In transit</span></strong><small>Banganapalle mangoes · ETA 28 Nov</small><div className="shipment-progress"><i /><i /><i className="current" /><i /></div>
        </div>
      </aside>
    </div>
  </>;
}

function Stat({ icon, label, value, sub, color }: { icon: ReactNode; label: string; value: string; sub: string; color: string }) {
  return <Card className="stat-card"><div className={`stat-icon stat-${color}`}>{icon}</div><div className="stat-copy"><span>{label}</span><strong>{value}</strong><small>{sub}</small></div><ArrowUpRight className="stat-arrow" size={15} /></Card>;
}

function LotCard({ lot, onProducer, saved, onSave }: { lot: SupplyLot; onProducer: () => void; saved: boolean; onSave: () => void }) {
  return <Card className="lot-card"><div className={`lot-image lot-${lot.tone}`}><span className="lot-produce-emoji">{lot.icon}</span><div className="lot-image-top"><Badge className={lot.verified ? "lot-verified" : "lot-pending"}>{lot.verified ? <><CheckCircle2 size={12} /> Traceable lot</> : <><Eye size={12} /> Check in progress</>}</Badge><button className={`save-button ${saved ? "saved" : ""}`} onClick={onSave} aria-label={saved ? "Remove saved lot" : "Save lot"}><Bookmark size={15} fill={saved ? "currentColor" : "none"} /></button></div><span className="lot-id">{lot.id}</span></div><div className="lot-card-body"><div className="lot-title-row"><div><h3>{lot.variety}</h3><span>{lot.crop}</span></div><strong className="lot-price">{lot.price}</strong></div><button className="producer-link" onClick={onProducer}><span className="producer-mini-avatar">{lot.producer.split(" ").map((word) => word[0]).slice(0, 2).join("")}</span><span>{lot.producer}</span><ExternalLink size={12} /></button><div className="lot-meta"><span><MapPin size={13} />{lot.location.split(",")[0]}</span><span><Warehouse size={13} />{lot.quantity}</span></div><Separator className="lot-divider" /><div className="lot-footer"><StatusPill tone={lot.verified ? "green" : "amber"}>{lot.grade}</StatusPill><span className="harvest-label"><CalendarDays size={13} />{lot.harvest}</span></div><button className="request-button" onClick={onProducer}>View lot details <ArrowRight size={14} /></button></div></Card>;
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
  return <div className="network-view"><div className="network-banner"><div><div className="eyebrow">BUILT FOR AGRI-FOOD TRADE</div><h2>Good partnerships<br />grow from <i>good information.</i></h2><p>Explore verified producer profiles and discover the right partners for your next order.</p></div><div className="network-banner-art"><div className="network-orbit orbit-one" /><div className="network-orbit orbit-two" /><div className="network-avatar nva-one">KF</div><div className="network-avatar nva-two">LC</div><div className="network-avatar nva-three">SF</div><div className="network-center"><Globe2 size={27} /></div></div></div>
    <SectionHeading title="Producer groups to know" detail="Company profiles, member scale, crop focus, and trade readiness" action={<button className="filter-button"><Filter size={15} /> Filter</button>} />
    <div className="profiles-grid">{producerProfiles.map((profile) => <Card className="profile-card" key={profile.name}><div className={`profile-cover cover-${profile.color}`}><span className="profile-cover-symbol">{profile.initials}</span><button className="save-button"><Bookmark size={15} /></button></div><div className="profile-content"><div className="profile-logo">{profile.initials}</div><div className="profile-title"><div><h3>{profile.name}</h3><span>{profile.type}</span></div>{profile.verified && <Badge className="profile-verified"><ShieldCheck size={12} /> Verified</Badge>}</div><div className="profile-region"><MapPin size={14} />{profile.region}</div><div className="profile-facts"><div><Users size={15} /><span>{profile.members}</span></div><div><Leaf size={15} /><span>{profile.crops}</span></div></div><div className="profile-reliability"><span className="reliability-mark"><Check size={13} /></span>{profile.reliability}</div><div className="profile-rating"><span className="rating-stars"><Star size={12} fill="currentColor" /> {profile.rating}</span><span>{profile.reviews} trade reviews</span></div><button className="profile-button" onClick={() => setCompany(profile)}>View company profile <ArrowRight size={14} /></button></div></Card>)}</div>
    <div className="network-note"><Sparkles size={16} /><span>Profiles are built around practical trade details: member base, crop calendar, quality records, and logistics reach.</span></div>
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
  const shipment = shipments[selectedShipment];
  const steps = ["Farm collection", "Packhouse & quality", "Export cleared", "In transit", "Buyer delivery"];
  return <div className="shipments-view"><div className="shipment-controls"><div><div className="eyebrow">LIVE LOGISTICS · DEMO DATA</div><h2>Shipments in motion</h2><p>Follow each lot from the collection point to its buyer.</p></div><button className="button-quiet"><Filter size={15} /> Filter shipments</button></div>
    <div className="shipment-layout"><div className="shipment-list">{shipments.map((item, index) => <button key={item.id} onClick={() => setSelectedShipment(index)} className={`shipment-list-item ${selectedShipment === index ? "selected" : ""}`}><div className="shipment-list-top"><span className="shipment-id">{item.id}</span><StatusPill tone={item.step > 1 ? "blue" : item.step === 1 ? "amber" : "gray"}>{item.status}</StatusPill></div><strong>{item.crop}</strong><span className="shipment-route-text"><MapPin size={13} />{item.from}<ArrowRight size={12} />{item.to}</span><div className="shipment-list-bottom"><span>{item.qty}</span><span>ETA {item.eta.split(",")[0]}</span></div></button>)}</div>
      <div className="shipment-detail"><div className="shipment-detail-head"><div><div className="eyebrow">{shipment.id} · {shipment.carrier}</div><h3>{shipment.crop}</h3><span>{shipment.qty} <i>·</i> {shipment.from} to {shipment.to}</span></div><Button className="primary-button small-primary"><ExternalLink size={14} /> Open tracking link</Button></div>
        <div className="map-toolbar"><span><Globe2 size={15} /> INDIA <ArrowRight size={13} /> SINGAPORE</span><span className="map-legend"><i className="legend-origin" /> Origin <i className="legend-current" /> Current leg <i className="legend-destination" /> Destination</span><span className="map-scale">SEA ROUTE · EST. 3,200 KM</span></div><div className="route-map mapcn-route-map"><MapCN center={[91.3, 7.2]} zoom={3.2} className="shipment-map-canvas"><MapRoute coordinates={shipmentCoordinates} progress={Math.min(0.95, (shipment.step + 1) / 5)} color="#a8bd9f" width={5} opacity={0.9} activeColor="#4f8a62" activeWidth={5} activeOpacity={1}><RouteProgress color="#4f8a62" width={5} opacity={1} /><RouteMarker at="start"><MarkerContent><div className="mapcn-point mapcn-origin">IN</div></MarkerContent><MarkerTooltip>Collection · Chittoor, Andhra Pradesh</MarkerTooltip></RouteMarker><RouteMarker at="progress"><MarkerContent><div className="mapcn-current"><Truck size={13} /></div></MarkerContent><MarkerTooltip>Shipment position · {shipment.status}</MarkerTooltip></RouteMarker><RouteMarker at="end"><MarkerContent><div className="mapcn-point mapcn-destination">SG</div></MarkerContent><MarkerTooltip>Buyer delivery · Singapore</MarkerTooltip></RouteMarker></MapRoute><MapMarker longitude={80.27} latitude={13.08}><MarkerContent><div className="mapcn-port">2</div></MarkerContent><MarkerTooltip>Export port · Chennai</MarkerTooltip></MapMarker><MapControls position="bottom-right" showCompass showFullscreen /></MapCN><div className="mapcn-status"><span className="signal-dot" /> {shipment.status}<small>Updated 2h ago</small></div></div><div className="map-route-footer"><span><Truck size={14} /> Chittoor packhouse <small>Origin</small></span><i /><span><PackageCheck size={14} /> Chennai port <small>Export cleared</small></span><i className="active-leg" /><span><Globe2 size={14} /> Singapore <small>ETA {shipment.eta}</small></span></div>
        <div className="shipment-progress-track">{steps.map((step, index) => <div className={`shipment-step ${index < shipment.step ? "complete" : index === shipment.step ? "active" : ""}`} key={step}><span className="step-circle">{index < shipment.step ? <Check size={12} /> : index + 1}</span><span>{step}</span></div>)}</div>
        <div className="shipment-detail-grid"><div><span>Estimated arrival</span><strong>{shipment.eta}</strong></div><div><span>Transport partner</span><strong>{shipment.carrier}</strong></div><div><span>Documents</span><strong className="doc-ready"><CheckCircle2 size={14} /> 4 of 4 attached</strong></div></div>
      </div></div>
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
