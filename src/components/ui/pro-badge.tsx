/** Gold "PRO" marker for Farmora Pro features (nav tab and page headers). */
export function ProBadge({ size = "sm" }: { size?: "sm" | "md" }) {
  const md = size === "md";
  return (
    <span
      aria-label="Farmora Pro"
      title="Farmora Pro feature"
      style={{
        display: "inline-flex", alignItems: "center", gap: 3, marginLeft: md ? 0 : 6, verticalAlign: "middle",
        padding: md ? "3px 9px" : "1px 6px", borderRadius: 999, fontSize: md ? 11 : 9.5, fontWeight: 800, letterSpacing: md ? 1.2 : 0.8,
        color: "#3a2a06", background: "linear-gradient(135deg,#FFE58A,#F5B83D 55%,#E8932F)",
        boxShadow: "0 0 0 1px #FFE58A66, 0 2px 10px #F5B83D55", lineHeight: 1.4,
      }}
    >
      <svg width={md ? 10 : 8} height={md ? 10 : 8} viewBox="0 0 24 24" aria-hidden="true"><path fill="#3a2a06" d="M12 2l2.9 6.6 7.1.6-5.4 4.7 1.6 7L12 17.3 5.8 20.9l1.6-7L2 9.2l7.1-.6z" /></svg>
      PRO
    </span>
  );
}
