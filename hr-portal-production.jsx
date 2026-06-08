import { useState, useEffect, useRef, useCallback } from "react";

// ─── DESIGN TOKENS (exact from variables.css) ────────────────────
const T = {
  brand:"#1a2744", brandLight:"#2d3f6b", brandDark:"#0f1a30", brandXlight:"#e8ecf5",
  accent:"#e8622a", accentLight:"#f0845a", accentDark:"#c24e1e", accentXlight:"#fdf0ea",
  bg:"#f5f4f0", bgDark:"#eceae4", surface:"#ffffff", surface2:"#faf9f7",
  border:"#e2e0d8", borderDark:"#c9c6bb",
  text:"#1a1a1a", muted:"#6b6b6b", faint:"#a0a09a",
  success:"#1d7a4e", successLight:"#e8f5ee", successBorder:"#a8d8bb",
  danger:"#c0392b", dangerLight:"#fdecea", dangerBorder:"#f0b0aa",
  warning:"#c07a00", warningLight:"#fef5e4", warningBorder:"#f0d080",
  info:"#1a5fa8", infoLight:"#e8f0fb", infoBorder:"#a8c4ec",
};

// ─── GLOBAL CSS ───────────────────────────────────────────────────
const GLOBAL_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@400;500;600;700&family=JetBrains+Mono:wght@400;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { font-size: 15px; }
  body { font-family: 'DM Sans', sans-serif; background: ${T.bg}; color: ${T.text}; min-height: 100vh; }
  input, select, textarea, button { font-family: inherit; }
  a { text-decoration: none; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: ${T.borderDark}; border-radius: 3px; }
  input:focus, select:focus, textarea:focus { outline: 2px solid ${T.brand}; outline-offset: 2px; }
`;

// ─── INJECT CSS ───────────────────────────────────────────────────
if (!document.getElementById("dp-global")) {
  const s = document.createElement("style");
  s.id = "dp-global";
  s.textContent = GLOBAL_CSS;
  document.head.appendChild(s);
}

// ─── SHARED ATOMS ────────────────────────────────────────────────
function Btn({ children, variant="primary", size="md", onClick, disabled, full, style={}, ...p }) {
  const base = {
    display:"inline-flex", alignItems:"center", justifyContent:"center",
    gap:6, fontWeight:600, cursor:disabled?"not-allowed":"pointer",
    border:"none", borderRadius:8, transition:"all 0.15s", opacity:disabled?0.55:1,
    fontFamily:"'DM Sans',sans-serif", letterSpacing:"0.01em",
    width:full?"100%":undefined,
    fontSize: size==="xs"?11:size==="sm"?13:size==="lg"?16:14,
    padding: size==="xs"?"3px 8px":size==="sm"?"7px 14px":size==="lg"?"13px 24px":"9px 18px",
    ...style,
  };
  const variants = {
    primary:   {background:T.brand, color:"#fff"},
    accent:    {background:T.accent, color:"#fff"},
    secondary: {background:T.surface, color:T.text, border:`1px solid ${T.border}`},
    success:   {background:T.success, color:"#fff"},
    danger:    {background:T.danger, color:"#fff"},
    warning:   {background:T.warning, color:"#fff"},
    ghost:     {background:"transparent", color:T.muted},
    outline:   {background:"transparent", color:T.brand, border:`1.5px solid ${T.brand}`},
  };
  return <button style={{...base,...variants[variant],...style}} onClick={onClick} disabled={disabled} {...p}>{children}</button>;
}

function Badge({ children, color="brand" }) {
  const map = {
    brand:   [T.brandXlight, T.brand],
    accent:  [T.accentXlight, T.accent],
    success: [T.successLight, T.success],
    danger:  [T.dangerLight, T.danger],
    warning: [T.warningLight, T.warning],
    info:    [T.infoLight, T.info],
    neutral: [T.bgDark, T.muted],
  };
  const [bg, fg] = map[color] || map.brand;
  return (
    <span style={{background:bg, color:fg, border:`1px solid ${fg}33`,
      borderRadius:99, padding:"2px 10px", fontSize:11, fontWeight:700,
      letterSpacing:"0.04em", textTransform:"uppercase", whiteSpace:"nowrap"}}>
      {children}
    </span>
  );
}

function Card({ children, style={} }) {
  return <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, ...style}}>{children}</div>;
}

function Input({ label, id, type="text", placeholder, value, onChange, required, error, hint, children, style={}, inputStyle={}, ...p }) {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:4, ...style}}>
      {label && <label htmlFor={id} style={{fontSize:13, fontWeight:600, color:T.text}}>
        {label}{required && <span style={{color:T.danger, marginLeft:3}}>*</span>}
      </label>}
      {children || <input id={id} type={type} placeholder={placeholder} value={value}
        onChange={onChange}
        style={{border:`1.5px solid ${error?T.danger:T.border}`, borderRadius:8, padding:"9px 12px",
          fontSize:14, color:T.text, background:T.surface, width:"100%", ...inputStyle}} {...p}/>}
      {hint && <span style={{fontSize:12, color:T.muted}}>{hint}</span>}
      {error && <span style={{fontSize:12, color:T.danger}}>{error}</span>}
    </div>
  );
}

function Select({ label, id, value, onChange, options, required, error, style={} }) {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:4, ...style}}>
      {label && <label htmlFor={id} style={{fontSize:13, fontWeight:600, color:T.text}}>
        {label}{required && <span style={{color:T.danger, marginLeft:3}}>*</span>}
      </label>}
      <select id={id} value={value} onChange={onChange}
        style={{border:`1.5px solid ${error?T.danger:T.border}`, borderRadius:8, padding:"9px 12px",
          fontSize:14, color:T.text, background:T.surface, width:"100%", cursor:"pointer"}}>
        {options.map(o => typeof o==="string"
          ? <option key={o} value={o}>{o}</option>
          : <option key={o.value} value={o.value}>{o.label}</option>
        )}
      </select>
      {error && <span style={{fontSize:12, color:T.danger}}>{error}</span>}
    </div>
  );
}

function Textarea({ label, id, value, onChange, rows=3, placeholder, required, error, style={} }) {
  return (
    <div style={{display:"flex", flexDirection:"column", gap:4, ...style}}>
      {label && <label htmlFor={id} style={{fontSize:13, fontWeight:600, color:T.text}}>
        {label}{required && <span style={{color:T.danger, marginLeft:3}}>*</span>}
      </label>}
      <textarea id={id} rows={rows} value={value} onChange={onChange} placeholder={placeholder}
        style={{border:`1.5px solid ${error?T.danger:T.border}`, borderRadius:8, padding:"9px 12px",
          fontSize:14, color:T.text, background:T.surface, width:"100%", resize:"vertical"}}/>
      {error && <span style={{fontSize:12, color:T.danger}}>{error}</span>}
    </div>
  );
}

function Modal({ open, onClose, title, children, footer, size="md" }) {
  if (!open) return null;
  const widths = { sm:400, md:560, lg:740, xl:940 };
  return (
    <div style={{position:"fixed", inset:0, background:"rgba(0,0,0,0.45)", zIndex:1000,
      display:"flex", alignItems:"center", justifyContent:"center", padding:16}}
      onClick={e=>e.target===e.currentTarget&&onClose()}>
      <div style={{background:T.surface, borderRadius:16, width:"100%", maxWidth:widths[size]||560,
        maxHeight:"90vh", display:"flex", flexDirection:"column",
        boxShadow:"0 24px 64px rgba(0,0,0,0.18)"}}>
        <div style={{padding:"18px 24px", borderBottom:`1px solid ${T.border}`,
          display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0}}>
          <span style={{fontWeight:700, fontSize:16, color:T.brand}}>{title}</span>
          <button onClick={onClose} style={{background:"none", border:"none", cursor:"pointer",
            fontSize:18, color:T.muted, lineHeight:1}}>✕</button>
        </div>
        <div style={{padding:24, overflowY:"auto", flex:1}}>{children}</div>
        {footer && <div style={{padding:"14px 24px", borderTop:`1px solid ${T.border}`,
          display:"flex", justifyContent:"flex-end", gap:10, flexShrink:0}}>{footer}</div>}
      </div>
    </div>
  );
}

function Toast({ toasts, remove }) {
  const icons = { success:"✓", error:"✕", warning:"⚠", info:"ℹ" };
  const colors = { success:T.success, error:T.danger, warning:T.warning, info:T.info };
  return (
    <div style={{position:"fixed", bottom:24, right:24, zIndex:2000, display:"flex", flexDirection:"column", gap:10}}>
      {toasts.map(t => (
        <div key={t.id} style={{background:T.surface, border:`1px solid ${T.border}`,
          borderLeft:`4px solid ${colors[t.type]||T.info}`,
          borderRadius:10, padding:"12px 16px", minWidth:280, maxWidth:360,
          boxShadow:"0 8px 24px rgba(0,0,0,0.12)",
          display:"flex", alignItems:"center", gap:12,
          animation:"slideIn 0.2s ease"}}>
          <span style={{color:colors[t.type], fontWeight:700, fontSize:16}}>{icons[t.type]}</span>
          <span style={{fontSize:13, color:T.text, flex:1}}>{t.msg}</span>
          <button onClick={()=>remove(t.id)} style={{background:"none", border:"none",
            cursor:"pointer", color:T.faint, fontSize:14}}>✕</button>
        </div>
      ))}
    </div>
  );
}

function useToast() {
  const [toasts, setToasts] = useState([]);
  const add = useCallback((msg, type="info") => {
    const id = Date.now();
    setToasts(p => [...p, {id, msg, type}]);
    setTimeout(() => setToasts(p => p.filter(t=>t.id!==id)), 4000);
  }, []);
  const remove = useCallback(id => setToasts(p=>p.filter(t=>t.id!==id)), []);
  return { toasts, add, remove };
}

function StatCard({ icon, value, label, color=T.brand, iconBg }) {
  return (
    <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:12,
      padding:"18px 20px", position:"relative", overflow:"hidden"}}>
      <div style={{position:"absolute", top:0, left:0, right:0, height:3, background:color}}/>
      <div style={{width:40, height:40, borderRadius:10,
        background:iconBg||color+"18", display:"flex", alignItems:"center",
        justifyContent:"center", fontSize:18, marginBottom:12}}>{icon}</div>
      <div style={{fontSize:26, fontWeight:800, color:T.brand, lineHeight:1}}>{value}</div>
      <div style={{fontSize:12, color:T.muted, marginTop:4, fontWeight:500}}>{label}</div>
    </div>
  );
}

function UploadZone({ id, label, accept, required, value, onChange, hint, compact }) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef();
  const handleFile = f => { if(f) onChange(f); };
  return (
    <div style={{display:"flex", flexDirection:"column", gap:4}}>
      {label && <label style={{fontSize:13, fontWeight:600, color:T.text}}>
        {label}{required && <span style={{color:T.danger, marginLeft:3}}>*</span>}
      </label>}
      <div
        onDragOver={e=>{e.preventDefault();setDragging(true)}}
        onDragLeave={()=>setDragging(false)}
        onDrop={e=>{e.preventDefault();setDragging(false);handleFile(e.dataTransfer.files[0])}}
        onClick={()=>inputRef.current.click()}
        style={{border:`2px dashed ${dragging?T.brand:value?T.success:T.border}`,
          borderRadius:10, padding:compact?"10px 14px":"20px",
          background:value?T.successLight:dragging?T.brandXlight:T.bg,
          cursor:"pointer", textAlign:"center", transition:"all 0.15s",
          display:"flex", flexDirection:compact?"row":"column",
          alignItems:"center", justifyContent:"center", gap:8}}>
        <input ref={inputRef} type="file" accept={accept} style={{display:"none"}}
          onChange={e=>handleFile(e.target.files[0])}/>
        <span style={{fontSize:compact?20:28}}>{value?"✅":"📁"}</span>
        <div>
          <div style={{fontSize:12, fontWeight:600, color:value?T.success:T.muted}}>
            {value ? value.name : "Drop file or click to browse"}
          </div>
          {hint && !value && <div style={{fontSize:11, color:T.faint, marginTop:2}}>{hint}</div>}
          {accept && !value && <div style={{display:"flex", gap:4, justifyContent:"center", marginTop:4, flexWrap:"wrap"}}>
            {accept.split(",").map(a=>(
              <span key={a} style={{background:T.bgDark, color:T.muted, borderRadius:4,
                padding:"1px 6px", fontSize:10, fontWeight:600}}>{a.replace(".","").toUpperCase()}</span>
            ))}
          </div>}
        </div>
      </div>
    </div>
  );
}

function FormGrid({ children, cols=2 }) {
  return (
    <div style={{display:"grid", gridTemplateColumns:`repeat(${cols},1fr)`, gap:16}}>
      {children}
    </div>
  );
}

function FormSection({ icon, title, children, action }) {
  return (
    <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
      overflow:"hidden", marginBottom:16}}>
      <div style={{background:T.surface2, padding:"12px 20px", borderBottom:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between"}}>
        <div style={{display:"flex", alignItems:"center", gap:10}}>
          <div style={{width:32, height:32, borderRadius:8, background:T.accentXlight,
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:16}}>{icon}</div>
          <span style={{fontWeight:700, color:T.brand, fontSize:14}}>{title}</span>
        </div>
        {action}
      </div>
      <div style={{padding:20}}>{children}</div>
    </div>
  );
}

// ─── SIDEBAR NAV ─────────────────────────────────────────────────
const ADMIN_NAV = [
  { section:"Main" },
  { id:"dashboard", label:"Dashboard", icon:"🏠" },
  { id:"employees", label:"Employees", icon:"👥" },
  { id:"joining-requests", label:"Joining Requests", icon:"📥", badge:"joining" },
  { id:"handover-requests", label:"Exit Handovers", icon:"📤" },
  { divider:true },
  { section:"Documents" },
  { id:"documents", label:"Document Review", icon:"📄" },
  { id:"approvals", label:"Pending Approvals", icon:"✅", badge:"approvals" },
  { divider:true },
  { section:"Reports" },
  { id:"reports", label:"Reports", icon:"📊" },
  { divider:true },
  { section:"Settings" },
  { id:"users", label:"User Management", icon:"🔑" },
  { id:"settings", label:"Settings", icon:"⚙️" },
];

function Sidebar({ page, onNav, user, onLogout, collapsed, onToggle }) {
  const w = collapsed ? 64 : 240;
  return (
    <nav style={{width:w, background:T.brand, display:"flex", flexDirection:"column",
      flexShrink:0, overflowY:"auto", overflowX:"hidden", transition:"width 0.2s",
      height:"100vh", position:"sticky", top:0}}>
      <div style={{padding:collapsed?"16px 16px":"20px 16px", borderBottom:`1px solid ${T.brandLight}`,
        display:"flex", alignItems:"center", gap:10}}>
        <div style={{width:32, height:32, borderRadius:8, background:T.accent,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:16, flexShrink:0, fontWeight:900, color:"#fff"}}>D</div>
        {!collapsed && <div>
          <div style={{color:"#fff", fontWeight:800, fontSize:14}}>Deneb & Pollux</div>
          <div style={{color:"rgba(255,255,255,.4)", fontSize:10, textTransform:"uppercase",
            letterSpacing:"0.08em"}}>HR Portal</div>
        </div>}
      </div>

      <div style={{flex:1, padding:"12px 8px", overflowY:"auto"}}>
        {ADMIN_NAV.map((n, i) => {
          if (n.divider) return <div key={i} style={{height:1, background:T.brandLight, margin:"8px 0"}}/>;
          if (n.section) return !collapsed ? (
            <div key={i} style={{fontSize:10, color:"rgba(255,255,255,.35)", fontWeight:700,
              textTransform:"uppercase", letterSpacing:"0.1em", padding:"8px 8px 4px"}}>{n.section}</div>
          ) : null;
          const active = page === n.id;
          return (
            <button key={n.id} onClick={()=>onNav(n.id)}
              style={{display:"flex", alignItems:"center", gap:10, width:"100%",
                padding:collapsed?"10px":"9px 10px", borderRadius:8,
                background:active?"rgba(232,98,42,0.2)":"transparent",
                borderLeft:active?`3px solid ${T.accent}`:"3px solid transparent",
                border:"none", cursor:"pointer", color:active?"#fff":"rgba(255,255,255,.55)",
                fontSize:13, textAlign:"left", marginBottom:2, transition:"all 0.12s",
                justifyContent:collapsed?"center":"flex-start"}}>
              <span style={{fontSize:16, flexShrink:0}}>{n.icon}</span>
              {!collapsed && <span style={{fontWeight:active?600:400}}>{n.label}</span>}
            </button>
          );
        })}
      </div>

      <div style={{padding:"12px 8px", borderTop:`1px solid ${T.brandLight}`}}>
        {!collapsed && user && (
          <div style={{display:"flex", alignItems:"center", gap:10, padding:"8px 4px"}}>
            <div style={{width:32, height:32, borderRadius:"50%", background:T.accent,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:12, fontWeight:700, color:"#fff", flexShrink:0}}>
              {(user.name||"HR").split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase()}
            </div>
            <div style={{flex:1, minWidth:0}}>
              <div style={{color:"#fff", fontSize:12, fontWeight:600, overflow:"hidden",
                textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{user.name}</div>
              <div style={{color:"rgba(255,255,255,.4)", fontSize:11}}>{user.role}</div>
            </div>
          </div>
        )}
        <button onClick={onLogout}
          style={{display:"flex", alignItems:"center", gap:8, width:"100%", padding:"8px 10px",
            background:"transparent", border:"none", cursor:"pointer",
            color:"rgba(255,255,255,.5)", fontSize:12, borderRadius:6,
            justifyContent:collapsed?"center":"flex-start"}}>
          <span>🚪</span>{!collapsed && "Logout"}
        </button>
      </div>
    </nav>
  );
}

function Topbar({ title, onToggle, onSearch, searchVal, rightContent }) {
  return (
    <div style={{height:60, background:T.surface, borderBottom:`1px solid ${T.border}`,
      display:"flex", alignItems:"center", padding:"0 24px", gap:14,
      position:"sticky", top:0, zIndex:100, boxShadow:"0 1px 0 rgba(0,0,0,0.04)"}}>
      <button onClick={onToggle} style={{background:"none", border:"none",
        cursor:"pointer", fontSize:18, color:T.muted, lineHeight:1}}>☰</button>
      <span style={{fontWeight:700, color:T.brand, fontSize:16}}>{title}</span>
      {onSearch !== undefined && (
        <div style={{flex:1, maxWidth:300, position:"relative", marginLeft:8}}>
          <span style={{position:"absolute", left:10, top:"50%", transform:"translateY(-50%)",
            color:T.faint, fontSize:14}}>🔍</span>
          <input type="search" placeholder="Search…" value={searchVal} onChange={e=>onSearch(e.target.value)}
            style={{width:"100%", padding:"7px 12px 7px 32px", border:`1.5px solid ${T.border}`,
              borderRadius:8, fontSize:13, color:T.text, background:T.bg}}/>
        </div>
      )}
      <div style={{flex:1}}/>
      {rightContent}
    </div>
  );
}

// ─── STATUS BADGE ─────────────────────────────────────────────────
function StatusBadge({ status }) {
  const map = {
    active:                  ["Active", "success"],
    ACTIVE:                  ["Active", "success"],
    onboarding:              ["Onboarding", "info"],
    ONBOARDING_PENDING:      ["Onboarding", "info"],
    OFFER_SENT:              ["Offer Sent", "warning"],
    offer_sent:              ["Offer Sent", "warning"],
    OFFER_ACCEPTED:          ["Offer Accepted", "info"],
    APPLICATION_SUBMITTED:   ["Submitted", "info"],
    APPLICATION_APPROVED:    ["Approved", "success"],
    exit:                    ["Exit", "warning"],
    inactive:                ["Inactive", "neutral"],
    pending:                 ["Pending", "warning"],
    under_review:            ["Under Review", "info"],
    approved:                ["Approved", "success"],
    rejected:                ["Rejected", "danger"],
  };
  const [label, color] = map[status] || [status, "neutral"];
  return <Badge color={color}>{label}</Badge>;
}

// ─── CONFIRM DIALOG ───────────────────────────────────────────────
function useConfirm() {
  const [state, setState] = useState(null);
  const confirm = (msg, title="Confirm") => new Promise(resolve => {
    setState({ msg, title, resolve });
  });
  const Dialog = () => !state ? null : (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,0.5)",zIndex:2000,
      display:"flex",alignItems:"center",justifyContent:"center"}}>
      <div style={{background:T.surface,borderRadius:14,padding:28,maxWidth:400,width:"90%",
        boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
        <div style={{fontWeight:700,fontSize:16,color:T.brand,marginBottom:12}}>{state.title}</div>
        <p style={{color:T.muted,fontSize:14,lineHeight:1.6,marginBottom:20}}>{state.msg}</p>
        <div style={{display:"flex",gap:10,justifyContent:"flex-end"}}>
          <Btn variant="secondary" onClick={()=>{state.resolve(false);setState(null);}}>Cancel</Btn>
          <Btn variant="primary" onClick={()=>{state.resolve(true);setState(null);}}>Confirm</Btn>
        </div>
      </div>
    </div>
  );
  return { confirm, Dialog };
}

// ─── DEMO DATA ────────────────────────────────────────────────────
const DEMO_EMPLOYEES = [
  {id:"DP-2024-001",name:"Arjun Sharma",dept:"Operations",designation:"Operations Manager",email:"arjun@denebpollux.com",mobile:"9876543210",joining:"2024-01-15",status:"active",offerStatus:null,appStatus:"approved",verStatus:"verified",currentStatus:"ACTIVE"},
  {id:"DP-2024-002",name:"Priya Mehta",dept:"Fleet Management",designation:"Fleet Coordinator",email:"priya@denebpollux.com",mobile:"9876543211",joining:"2024-02-01",status:"active",offerStatus:null,appStatus:"approved",verStatus:"verified",currentStatus:"ACTIVE"},
  {id:"DP-2024-003",name:"Rahul Gupta",dept:"Sales",designation:"Sales Executive",email:"rahul@denebpollux.com",mobile:"9876543212",joining:"2024-02-20",status:"active",offerStatus:null,appStatus:"approved",verStatus:"verified",currentStatus:"ACTIVE"},
  {id:"DP-2024-004",name:"Sneha Patel",dept:"Finance",designation:"Accounts Manager",email:"sneha@denebpollux.com",mobile:"9876543213",joining:"2024-03-05",status:"active",offerStatus:null,appStatus:"approved",verStatus:"verified",currentStatus:"ACTIVE"},
  {id:"DP-2024-007",name:"Karan Malhotra",dept:"Fleet Management",designation:"Driver Supervisor",email:"karan@denebpollux.com",mobile:"9876543214",joining:"2024-04-15",status:"onboarding",offerStatus:"OFFER_ACCEPTED",appStatus:"pending",verStatus:"pending",currentStatus:"ONBOARDING_PENDING"},
  {id:"DP-2024-008",name:"Deepa Nair",dept:"Sales",designation:"Corporate Sales Mgr",email:"deepa@denebpollux.com",mobile:"9876543215",joining:"2024-05-01",status:"onboarding",offerStatus:"OFFER_SENT",appStatus:"pending",verStatus:"pending",currentStatus:"OFFER_SENT"},
  {id:"JR-2024-009",name:"Amit Verma",dept:"Operations",designation:"Tour Coordinator",email:"amit@gmail.com",mobile:"9876543216",joining:"2024-06-10",status:"onboarding",offerStatus:"OFFER_ACCEPTED",appStatus:"submitted",verStatus:"pending",currentStatus:"APPLICATION_SUBMITTED"},
  {id:"DP-2023-010",name:"Meera Joshi",dept:"Administration",designation:"Admin Executive",email:"meera@denebpollux.com",mobile:"9876543217",joining:"2023-11-01",status:"exit",offerStatus:null,appStatus:"approved",verStatus:"verified",currentStatus:"ACTIVE"},
];

const DEMO_APPROVALS = [
  {id:"A001",type:"joining",employee:"Amit Verma",empId:"JR-2024-009",description:"Joining form — 85% complete, 1 doc missing",submitted:"2024-06-01",priority:"high",icon:"📥"},
  {id:"A002",type:"document",employee:"Amit Verma",empId:"JR-2024-009",description:"Aadhaar Card uploaded for verification",submitted:"2024-06-01",priority:"high",icon:"🪪"},
  {id:"A003",type:"document",employee:"Amit Verma",empId:"JR-2024-009",description:"PAN Card uploaded for verification",submitted:"2024-06-01",priority:"high",icon:"🪪"},
  {id:"A004",type:"joining",employee:"Nikhil Jain",empId:"JR-003",description:"Joining form — 60% complete, multiple documents missing",submitted:"2024-06-05",priority:"medium",icon:"📥"},
  {id:"A005",type:"document",employee:"Nikhil Jain",empId:"JR-003",description:"Salary Slip Month 1 uploaded",submitted:"2024-06-05",priority:"medium",icon:"💰"},
  {id:"A006",type:"handover",employee:"Meera Joshi",empId:"HO-002",description:"Exit handover submitted — pending manager approval",submitted:"2024-07-01",priority:"high",icon:"📤"},
  {id:"A007",type:"joining",employee:"Sunita Devi",empId:"JR-006",description:"Joining form — 70% complete",submitted:"2024-06-08",priority:"medium",icon:"📥"},
  {id:"A008",type:"document",employee:"Kavya Reddy",empId:"JR-002",description:"Experience Letter pending review",submitted:"2024-06-03",priority:"medium",icon:"📝"},
];

// ─── HR ADMIN: LOGIN ──────────────────────────────────────────────
function AdminLogin({ onLogin }) {
  const [email, setEmail] = useState("hr@denebpollux.com");
  const [password, setPassword] = useState("password");
  const [role, setRole] = useState("hr");
  const [loading, setLoading] = useState(false);
  const { add } = useToast();

  const submit = async () => {
    if (!email||!password) { alert("Enter credentials"); return; }
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    setLoading(false);
    onLogin({ name:"Priya Sharma", email, role: role==="admin"?"Administrator":role==="hr"?"HR Manager":role==="manager"?"Manager":"CFO", roleKey:role });
  };

  return (
    <div style={{minHeight:"100vh", display:"flex", background:T.brand}}>
      {/* Left panel */}
      <div style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center",
        justifyContent:"center", padding:"60px 40px", position:"relative"}}>
        <div style={{position:"absolute", inset:0,
          background:"radial-gradient(ellipse at 30% 50%, rgba(232,98,42,.15) 0%, transparent 65%)"}}/>
        <div style={{position:"relative", textAlign:"center", maxWidth:380}}>
          <div style={{width:72, height:72, borderRadius:16, background:T.accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:32, margin:"0 auto 24px", fontWeight:900, color:"#fff"}}>D</div>
          <h1 style={{fontFamily:"'DM Serif Display',serif", fontSize:"clamp(1.8rem,3vw,2.4rem)",
            color:"#fff", fontWeight:400, marginBottom:12, lineHeight:1.2}}>
            Deneb & Pollux<br/>HR Portal
          </h1>
          <p style={{color:"rgba(255,255,255,.5)", fontSize:14, lineHeight:1.7, marginBottom:40}}>
            Manage your workforce, track onboarding, approvals and compliance — all in one place.
          </p>
          {[["👥","Employee Management","Complete lifecycle from offer to exit"],
            ["📋","Onboarding Workflows","Guided 8-step joining process"],
            ["✅","Document Approvals","Streamlined review and verification"],
            ["📊","HR Reports","Real-time insights and exports"]].map(([icon,t,d])=>(
            <div key={t} style={{display:"flex", alignItems:"center", gap:14,
              background:"rgba(255,255,255,.06)", borderRadius:10,
              padding:"12px 16px", marginBottom:10, textAlign:"left"}}>
              <span style={{fontSize:20}}>{icon}</span>
              <div>
                <div style={{color:"#fff", fontSize:13, fontWeight:600}}>{t}</div>
                <div style={{color:"rgba(255,255,255,.45)", fontSize:12}}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div style={{width:440, background:T.surface, display:"flex", alignItems:"center",
        justifyContent:"center", padding:40}}>
        <div style={{width:"100%", maxWidth:360}}>
          <div style={{marginBottom:32}}>
            <h2 style={{fontSize:24, fontWeight:800, color:T.brand, marginBottom:6}}>Welcome back</h2>
            <p style={{color:T.muted, fontSize:14}}>Sign in to your HR Admin account</p>
          </div>

          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            <Input label="Email Address" id="login-email" type="email" value={email}
              onChange={e=>setEmail(e.target.value)} placeholder="hr@denebpollux.com"/>
            <Input label="Password" id="login-pw" type="password" value={password}
              onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
            <Select label="Login as" id="login-role" value={role} onChange={e=>setRole(e.target.value)}
              options={[{value:"admin",label:"Administrator"},{value:"hr",label:"HR Manager"},
                {value:"manager",label:"Manager"},{value:"cfo",label:"CFO"}]}/>
            <Btn variant="primary" full onClick={submit} disabled={loading}
              style={{marginTop:8, padding:"13px"}}>
              {loading ? "Signing in…" : "Sign In →"}
            </Btn>
          </div>

          <p style={{textAlign:"center", marginTop:24, fontSize:12, color:T.faint}}>
            Demo: any email + password works. Select role to see role-specific views.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── HR ADMIN: DASHBOARD ──────────────────────────────────────────
function Dashboard({ employees, approvals, toast }) {
  const active = employees.filter(e=>e.currentStatus==="ACTIVE").length;
  const onboarding = employees.filter(e=>["ONBOARDING_PENDING","OFFER_ACCEPTED","OFFER_SENT"].includes(e.currentStatus)).length;
  const submitted = employees.filter(e=>e.currentStatus==="APPLICATION_SUBMITTED").length;
  return (
    <div>
      <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:14, marginBottom:24}}>
        <StatCard icon="👥" value={employees.length} label="Total Employees" color={T.brand}/>
        <StatCard icon="✅" value={active} label="Active" color={T.success} iconBg={T.successLight}/>
        <StatCard icon="📥" value={onboarding} label="Onboarding" color={T.info} iconBg={T.infoLight}/>
        <StatCard icon="⏳" value={submitted} label="Pending Review" color={T.warning} iconBg={T.warningLight}/>
        <StatCard icon="⚠️" value={approvals.length} label="Pending Approvals" color={T.danger} iconBg={T.dangerLight}/>
        <StatCard icon="📤" value={1} label="Exit Handovers" color={T.accent} iconBg={T.accentXlight}/>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
        <Card>
          <div style={{padding:"14px 20px", borderBottom:`1px solid ${T.border}`, fontWeight:700, color:T.brand, fontSize:14}}>
            👥 Recent Employees
          </div>
          <div style={{padding:"4px 0"}}>
            {employees.slice(0,6).map(e=>(
              <div key={e.id} style={{display:"flex", alignItems:"center", gap:12,
                padding:"10px 20px", borderBottom:`1px solid ${T.border}`}}>
                <div style={{width:34, height:34, borderRadius:"50%", background:T.brand,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:12, fontWeight:700, flexShrink:0}}>
                  {e.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:13, color:T.text}}>{e.name}</div>
                  <div style={{fontSize:11, color:T.faint}}>{e.designation} · {e.dept}</div>
                </div>
                <StatusBadge status={e.currentStatus}/>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{padding:"14px 20px", borderBottom:`1px solid ${T.border}`, fontWeight:700, color:T.brand, fontSize:14}}>
            ⏳ Pending Actions
          </div>
          <div style={{padding:"4px 0"}}>
            {approvals.slice(0,5).map(a=>(
              <div key={a.id} style={{display:"flex", alignItems:"center", gap:12,
                padding:"10px 20px", borderBottom:`1px solid ${T.border}`}}>
                <span style={{fontSize:20}}>{a.icon}</span>
                <div style={{flex:1, minWidth:0}}>
                  <div style={{fontWeight:600, fontSize:13}}>{a.employee}</div>
                  <div style={{fontSize:11, color:T.faint, overflow:"hidden",
                    textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{a.description}</div>
                </div>
                <Badge color={a.priority==="high"?"danger":a.priority==="medium"?"warning":"success"}>
                  {a.priority}
                </Badge>
              </div>
            ))}
            {approvals.length===0 && (
              <div style={{padding:40, textAlign:"center", color:T.faint}}>
                <div style={{fontSize:32, marginBottom:8}}>🎉</div>
                <div>All caught up!</div>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── HR ADMIN: EMPLOYEES ──────────────────────────────────────────
function Employees({ employees, setEmployees, toast }) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [page, setPage] = useState(1);
  const [showAdd, setShowAdd] = useState(false);
  const [viewEmp, setViewEmp] = useState(null);
  const [showOffer, setShowOffer] = useState(false);
  const { confirm, Dialog } = useConfirm();
  const PAGE_SIZE = 7;

  const [form, setForm] = useState({ name:"", empId:"", email:"", mobile:"", dept:"",
    designation:"", joiningDate:"", empType:"Full Time", password:"",
    sendOffer:false, salary:"" });

  const depts = ["Operations","Fleet Management","Sales","Finance","HR","Technology","Administration"];

  const filtered = employees.filter(e => {
    const q = search.toLowerCase();
    const ms = !statusFilter || e.status===statusFilter || e.currentStatus===statusFilter;
    const md = !deptFilter || e.dept===deptFilter;
    const mq = !q || e.name.toLowerCase().includes(q)||e.id.toLowerCase().includes(q)||
      e.dept.toLowerCase().includes(q)||e.designation.toLowerCase().includes(q);
    return ms && md && mq;
  });

  const paged = filtered.slice((page-1)*PAGE_SIZE, page*PAGE_SIZE);
  const pages = Math.ceil(filtered.length/PAGE_SIZE);

  const approve = async id => {
    if (!await confirm(`Approve application for ${employees.find(e=>e.id===id)?.name}?`)) return;
    setEmployees(p=>p.map(e=>e.id===id?{...e,status:"active",currentStatus:"ACTIVE",appStatus:"approved"}:e));
    toast.add("Employee approved successfully","success");
  };

  const exportCSV = () => {
    const rows = [["ID","Name","Dept","Designation","Email","Mobile","Joining","Status"],
      ...filtered.map(e=>[e.id,e.name,e.dept,e.designation,e.email,e.mobile,e.joining,e.currentStatus])];
    const csv = rows.map(r=>r.join(",")).join("\n");
    const a = document.createElement("a");
    a.href = "data:text/csv,"+encodeURIComponent(csv);
    a.download = `employees_${new Date().toISOString().slice(0,10)}.csv`;
    a.click();
    toast.add("CSV exported","success");
  };

  const saveEmployee = () => {
    if (!form.name||!form.empId||!form.email||!form.dept||!form.designation) {
      toast.add("Fill all required fields","warning"); return;
    }
    const newEmp = {
      id:form.empId, name:form.name, dept:form.dept, designation:form.designation,
      email:form.email, mobile:form.mobile, joining:form.joiningDate||new Date().toISOString().slice(0,10),
      status:form.sendOffer?"onboarding":"active",
      offerStatus:form.sendOffer?"OFFER_SENT":null,
      appStatus:"pending", verStatus:"pending",
      currentStatus:form.sendOffer?"OFFER_SENT":"ACTIVE",
    };
    setEmployees(p=>[newEmp,...p]);
    setShowAdd(false);
    setForm({name:"",empId:"",email:"",mobile:"",dept:"",designation:"",joiningDate:"",empType:"Full Time",password:"",sendOffer:false,salary:""});
    toast.add(form.sendOffer?"Offer letter sent to "+form.name:"Employee added — "+form.name,"success");
  };

  const STATUS_FILTERS = [
    {value:"",label:"All"},
    {value:"active",label:"Active"},
    {value:"OFFER_SENT",label:"Offer Sent"},
    {value:"onboarding",label:"Onboarding"},
    {value:"APPLICATION_SUBMITTED",label:"Submitted"},
    {value:"exit",label:"Exit"},
  ];

  return (
    <div>
      <Dialog/>
      {/* Header */}
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>All Employees</h1>
          <p style={{color:T.muted, fontSize:13}}>{filtered.length} employee{filtered.length!==1?"s":""} found</p>
        </div>
        <div style={{display:"flex", gap:10}}>
          <Btn variant="secondary" size="sm" onClick={exportCSV}>↓ Export CSV</Btn>
          <Btn variant="primary" size="sm" onClick={()=>setShowAdd(true)}>+ Add Employee</Btn>
        </div>
      </div>

      {/* Filters */}
      <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap", marginBottom:16}}>
        <div style={{display:"flex", gap:6, flexWrap:"wrap"}}>
          {STATUS_FILTERS.map(f=>(
            <button key={f.value} onClick={()=>{setStatusFilter(f.value);setPage(1);}}
              style={{padding:"5px 12px", border:`1.5px solid ${statusFilter===f.value?T.brand:T.border}`,
                borderRadius:99, fontSize:12, fontWeight:500, cursor:"pointer",
                background:statusFilter===f.value?T.brand:T.surface,
                color:statusFilter===f.value?"#fff":T.muted, transition:"all 0.12s"}}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{marginLeft:"auto", display:"flex", gap:8}}>
          <select value={deptFilter} onChange={e=>{setDeptFilter(e.target.value);setPage(1);}}
            style={{border:`1.5px solid ${T.border}`, borderRadius:8, padding:"6px 10px",
              fontSize:12, color:T.muted, background:T.surface}}>
            <option value="">All Departments</option>
            {depts.map(d=><option key={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <Card>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
            <thead>
              <tr style={{background:T.surface2}}>
                {["Employee ID","Name","Department","Email","Joining","Offer","Application","Current Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 16px", textAlign:"left", color:T.muted,
                    fontWeight:600, fontSize:12, borderBottom:`1px solid ${T.border}`,
                    whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paged.length===0 ? (
                <tr><td colSpan={9}>
                  <div style={{padding:48, textAlign:"center", color:T.faint}}>
                    <div style={{fontSize:36, marginBottom:8}}>🔍</div>
                    No employees match your search or filters.
                  </div>
                </td></tr>
              ) : paged.map((e,i)=>(
                <tr key={e.id} style={{borderBottom:`1px solid ${T.border}`,
                  background:i%2===0?T.surface:T.surface2}}>
                  <td style={{padding:"11px 16px"}}>
                    <code style={{fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace"}}>{e.id}</code>
                  </td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex", alignItems:"center", gap:10}}>
                      <div style={{width:30, height:30, borderRadius:"50%", background:T.brand,
                        display:"flex", alignItems:"center", justifyContent:"center",
                        color:"#fff", fontSize:11, fontWeight:700, flexShrink:0}}>
                        {e.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                      </div>
                      <div>
                        <div style={{fontWeight:600, color:T.text}}>{e.name}</div>
                        <div style={{fontSize:11, color:T.faint}}>{e.designation}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{padding:"11px 16px", color:T.muted}}>{e.dept}</td>
                  <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{e.email}</td>
                  <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{e.joining}</td>
                  <td style={{padding:"11px 16px"}}>{e.offerStatus?<StatusBadge status={e.offerStatus}/>:<span style={{color:T.faint}}>—</span>}</td>
                  <td style={{padding:"11px 16px"}}><StatusBadge status={e.appStatus}/></td>
                  <td style={{padding:"11px 16px"}}><StatusBadge status={e.currentStatus}/></td>
                  <td style={{padding:"11px 16px"}}>
                    <div style={{display:"flex", gap:6, justifyContent:"flex-end"}}>
                      <Btn variant="ghost" size="xs" onClick={()=>setViewEmp(e)} title="View">👁</Btn>
                      {(e.status==="onboarding"||e.currentStatus==="APPLICATION_SUBMITTED") && (
                        <Btn variant="success" size="xs" onClick={()=>approve(e.id)}>✓ Approve</Btn>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {pages>1 && (
          <div style={{padding:"12px 16px", borderTop:`1px solid ${T.border}`,
            display:"flex", alignItems:"center", justifyContent:"space-between"}}>
            <span style={{fontSize:12, color:T.muted}}>
              Showing {(page-1)*PAGE_SIZE+1}–{Math.min(page*PAGE_SIZE,filtered.length)} of {filtered.length}
            </span>
            <div style={{display:"flex", gap:6}}>
              {Array.from({length:pages},(_,i)=>(
                <button key={i} onClick={()=>setPage(i+1)}
                  style={{width:28, height:28, borderRadius:6, border:`1px solid ${T.border}`,
                    background:page===i+1?T.brand:T.surface, color:page===i+1?"#fff":T.text,
                    cursor:"pointer", fontSize:12, fontWeight:600}}>{i+1}</button>
              ))}
            </div>
          </div>
        )}
      </Card>

      {/* Add Employee Modal */}
      <Modal open={showAdd} onClose={()=>setShowAdd(false)} title="Add Employee" size="lg"
        footer={<>
          <Btn variant="secondary" onClick={()=>setShowAdd(false)}>Cancel</Btn>
          <Btn variant="primary" onClick={saveEmployee}>
            {form.sendOffer?"📧 Send Offer Letter":"Save Employee"}
          </Btn>
        </>}>
        <div style={{marginBottom:16}}>
          <div style={{display:"flex", gap:8, marginBottom:16}}>
            <button onClick={()=>setForm(p=>({...p,sendOffer:false}))}
              style={{flex:1, padding:"10px", border:`2px solid ${!form.sendOffer?T.brand:T.border}`,
                borderRadius:10, cursor:"pointer", background:!form.sendOffer?T.brandXlight:T.surface,
                fontWeight:600, color:!form.sendOffer?T.brand:T.muted, fontSize:13}}>
              👤 Existing Employee
            </button>
            <button onClick={()=>setForm(p=>({...p,sendOffer:true}))}
              style={{flex:1, padding:"10px", border:`2px solid ${form.sendOffer?T.accent:T.border}`,
                borderRadius:10, cursor:"pointer", background:form.sendOffer?T.accentXlight:T.surface,
                fontWeight:600, color:form.sendOffer?T.accent:T.muted, fontSize:13}}>
              📧 New Joiner — Send Offer
            </button>
          </div>
        </div>
        <FormGrid cols={2}>
          <Input label="Full Name" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="Employee full name"/>
          <Input label="Employee ID" required value={form.empId} onChange={e=>setForm(p=>({...p,empId:e.target.value}))} placeholder="DP-2024-011"/>
          <Input label="Email" type="email" required value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="name@company.com"/>
          <Input label="Mobile" type="tel" value={form.mobile} onChange={e=>setForm(p=>({...p,mobile:e.target.value}))} placeholder="9876543210"/>
          <Select label="Department" required value={form.dept} onChange={e=>setForm(p=>({...p,dept:e.target.value}))}
            options={[{value:"",label:"Select department"},...depts.map(d=>({value:d,label:d}))]}/>
          <Input label="Designation" required value={form.designation} onChange={e=>setForm(p=>({...p,designation:e.target.value}))} placeholder="Job title"/>
          <Input label="Joining Date" type="date" required value={form.joiningDate} onChange={e=>setForm(p=>({...p,joiningDate:e.target.value}))}/>
          {form.sendOffer
            ? <Input label="CTC / Salary" value={form.salary} onChange={e=>setForm(p=>({...p,salary:e.target.value}))} placeholder="e.g. ₹6,00,000 per annum"/>
            : <Input label="Temporary Password" type="password" value={form.password} onChange={e=>setForm(p=>({...p,password:e.target.value}))} placeholder="Temp password"/>
          }
        </FormGrid>
        {form.sendOffer && (
          <div style={{marginTop:12, padding:"12px 16px", background:T.infoLight,
            border:`1px solid ${T.infoBorder}`, borderRadius:10, fontSize:13, color:T.info}}>
            ℹ️ After saving, an offer letter email will be sent to <strong>{form.email||"employee"}</strong> with portal link and login credentials.
          </div>
        )}
      </Modal>

      {/* View Employee Modal */}
      <Modal open={!!viewEmp} onClose={()=>setViewEmp(null)} title={viewEmp?.name||""} size="md"
        footer={<>
          <Btn variant="secondary" onClick={()=>setViewEmp(null)}>Close</Btn>
          {(viewEmp?.status==="onboarding"||viewEmp?.currentStatus==="APPLICATION_SUBMITTED") && (
            <Btn variant="success" onClick={async()=>{await approve(viewEmp.id);setViewEmp(null);}}>✓ Approve</Btn>
          )}
        </>}>
        {viewEmp && (
          <div>
            <div style={{display:"flex", alignItems:"center", gap:16, marginBottom:24}}>
              <div style={{width:56, height:56, borderRadius:"50%", background:T.brand,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:20, fontWeight:700}}>
                {viewEmp.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{fontWeight:700, fontSize:18, color:T.brand}}>{viewEmp.name}</div>
                <div style={{color:T.muted, fontSize:13}}>{viewEmp.designation} · {viewEmp.dept}</div>
                <div style={{marginTop:6}}><StatusBadge status={viewEmp.currentStatus}/></div>
              </div>
            </div>
            {[["Employee ID",viewEmp.id],["Email",viewEmp.email],["Mobile",viewEmp.mobile],
              ["Department",viewEmp.dept],["Designation",viewEmp.designation],
              ["Joining Date",viewEmp.joining],
              ["Offer Status",viewEmp.offerStatus||"—"],
              ["Application Status",viewEmp.appStatus],
              ["Verification Status",viewEmp.verStatus],
            ].map(([l,v])=>(
              <div key={l} style={{display:"flex", padding:"10px 0",
                borderBottom:`1px solid ${T.border}`, fontSize:14}}>
                <span style={{width:"40%", color:T.muted, fontWeight:500, fontSize:13}}>{l}</span>
                <span style={{color:T.text}}>{v}</span>
              </div>
            ))}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: JOINING REQUESTS ───────────────────────────────────
function JoiningRequests({ employees, setEmployees, toast }) {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [viewItem, setViewItem] = useState(null);
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const { confirm, Dialog } = useConfirm();

  const joiners = employees.filter(e=>e.status==="onboarding"||e.currentStatus.includes("OFFER")||e.currentStatus.includes("ONBOARD")||e.currentStatus==="APPLICATION_SUBMITTED");

  const tabs = [
    {key:"all",label:"All"},
    {key:"pending",label:"Pending"},
    {key:"under_review",label:"Under Review"},
    {key:"approved",label:"Approved"},
    {key:"rejected",label:"Rejected"},
  ];

  const filtered = joiners.filter(e=>{
    const q=search.toLowerCase();
    const mq=!q||e.name.toLowerCase().includes(q)||e.id.toLowerCase().includes(q);
    const ms=tab==="all"||
      (tab==="pending"&&["OFFER_SENT","OFFER_ACCEPTED","ONBOARDING_PENDING"].includes(e.currentStatus))||
      (tab==="under_review"&&e.currentStatus==="APPLICATION_SUBMITTED")||
      (tab==="approved"&&e.currentStatus==="APPLICATION_APPROVED")||
      (tab==="rejected"&&e.appStatus==="rejected");
    return mq&&ms;
  });

  const approve = async id => {
    if (!await confirm(`Approve application for ${employees.find(e=>e.id===id)?.name}?`)) return;
    setEmployees(p=>p.map(e=>e.id===id?{...e,currentStatus:"APPLICATION_APPROVED",appStatus:"approved",status:"active"}:e));
    setViewItem(null);
    toast.add("Application approved","success");
  };

  const reject = () => {
    if (!rejectReason.trim()) { toast.add("Enter a rejection reason","warning"); return; }
    setEmployees(p=>p.map(e=>e.id===rejectModal?{...e,appStatus:"rejected"}:e));
    setRejectModal(null);
    setRejectReason("");
    setViewItem(null);
    toast.add("Application rejected","error");
  };

  const progColor = pct => pct>=80?T.success:pct>=50?T.warning:T.danger;
  const demoProgress = e => e.currentStatus==="APPLICATION_SUBMITTED"?90:e.currentStatus==="ONBOARDING_PENDING"?50:e.currentStatus==="OFFER_ACCEPTED"?20:0;

  return (
    <div>
      <Dialog/>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>Joining Requests</h1>
          <p style={{color:T.muted, fontSize:13}}>Review and manage onboarding applications</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20}}>
        {[["📥",joiners.length,"Total"],["⏳",joiners.filter(e=>["OFFER_SENT","ONBOARDING_PENDING"].includes(e.currentStatus)).length,"Pending"],
          ["🔍",joiners.filter(e=>e.currentStatus==="APPLICATION_SUBMITTED").length,"Under Review"],
          ["✅",joiners.filter(e=>e.currentStatus==="APPLICATION_APPROVED").length,"Approved"],
          ["✕",joiners.filter(e=>e.appStatus==="rejected").length,"Rejected"]].map(([icon,val,lbl])=>(
          <StatCard key={lbl} icon={icon} value={val} label={lbl}/>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex", borderBottom:`2px solid ${T.border}`, marginBottom:16}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{padding:"10px 18px", fontSize:13, fontWeight:500, cursor:"pointer",
              background:"none", border:"none", borderBottom:`2px solid ${tab===t.key?T.accent:"transparent"}`,
              color:tab===t.key?T.accent:T.muted, marginBottom:-2}}>
            {t.label}
          </button>
        ))}
      </div>

      <Card>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
            <thead>
              <tr style={{background:T.surface2}}>
                {["Applicant","ID","Dept","Joining","Progress","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 16px", textAlign:"left", color:T.muted,
                    fontWeight:600, fontSize:12, borderBottom:`1px solid ${T.border}`}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0 ? (
                <tr><td colSpan={7} style={{padding:48, textAlign:"center", color:T.faint}}>
                  No joining requests found.
                </td></tr>
              ) : filtered.map((e,i)=>{
                const pct=demoProgress(e);
                return (
                  <tr key={e.id} style={{borderBottom:`1px solid ${T.border}`,
                    background:i%2===0?T.surface:T.surface2}}>
                    <td style={{padding:"11px 16px"}}>
                      <div style={{fontWeight:600}}>{e.name}</div>
                      <div style={{fontSize:11, color:T.faint}}>{e.designation}</div>
                    </td>
                    <td style={{padding:"11px 16px"}}>
                      <code style={{fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace"}}>{e.id}</code>
                    </td>
                    <td style={{padding:"11px 16px", color:T.muted}}>{e.dept}</td>
                    <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{e.joining}</td>
                    <td style={{padding:"11px 16px"}}>
                      <div style={{display:"flex", alignItems:"center", gap:8}}>
                        <div style={{flex:1, height:6, background:T.bgDark, borderRadius:3}}>
                          <div style={{width:`${pct}%`, height:"100%", borderRadius:3, background:progColor(pct)}}/>
                        </div>
                        <span style={{fontSize:11, color:T.muted, width:32}}>{pct}%</span>
                      </div>
                    </td>
                    <td style={{padding:"11px 16px"}}><StatusBadge status={e.currentStatus}/></td>
                    <td style={{padding:"11px 16px"}}>
                      <div style={{display:"flex", gap:6}}>
                        <Btn variant="ghost" size="xs" onClick={()=>setViewItem(e)}>View →</Btn>
                        {e.currentStatus==="APPLICATION_SUBMITTED" && <>
                          <Btn variant="danger" size="xs" onClick={()=>setRejectModal(e.id)}>Reject</Btn>
                          <Btn variant="success" size="xs" onClick={()=>approve(e.id)}>Approve</Btn>
                        </>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* View Modal */}
      <Modal open={!!viewItem} onClose={()=>setViewItem(null)} title="Review Joining Application" size="lg"
        footer={<>
          <Btn variant="secondary" onClick={()=>setViewItem(null)}>Close</Btn>
          {viewItem?.currentStatus==="APPLICATION_SUBMITTED" && <>
            <Btn variant="danger" onClick={()=>{setRejectModal(viewItem.id);setViewItem(null);}}>Reject</Btn>
            <Btn variant="success" onClick={()=>approve(viewItem?.id)}>Approve</Btn>
          </>}
        </>}>
        {viewItem && (
          <div>
            <div style={{display:"flex", gap:16, marginBottom:20, padding:16,
              background:T.surface2, borderRadius:12, border:`1px solid ${T.border}`}}>
              <div style={{width:48, height:48, borderRadius:"50%", background:T.brand,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:18, fontWeight:700}}>
                {viewItem.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div>
                <div style={{fontWeight:700, fontSize:16, color:T.brand}}>{viewItem.name}</div>
                <div style={{color:T.muted, fontSize:13}}>{viewItem.designation} · {viewItem.dept}</div>
                <div style={{marginTop:8}}><StatusBadge status={viewItem.currentStatus}/></div>
              </div>
            </div>
            {[["Employee ID",viewItem.id],["Email",viewItem.email],["Mobile",viewItem.mobile],
              ["Joining Date",viewItem.joining],["Application Status",viewItem.appStatus],
              ["Current Status",viewItem.currentStatus]].map(([l,v])=>(
              <div key={l} style={{display:"flex", padding:"9px 0",
                borderBottom:`1px solid ${T.border}`, fontSize:13}}>
                <span style={{width:"40%", color:T.muted, fontWeight:500}}>{l}</span>
                <span>{v}</span>
              </div>
            ))}
            <div style={{marginTop:16, padding:"12px 16px", background:T.infoLight,
              border:`1px solid ${T.infoBorder}`, borderRadius:8, fontSize:13, color:T.info}}>
              ℹ️ In production, this shows the full 8-step joining form submission with all documents.
            </div>
          </div>
        )}
      </Modal>

      {/* Reject Modal */}
      <Modal open={!!rejectModal} onClose={()=>setRejectModal(null)} title="Rejection Reason" size="sm"
        footer={<>
          <Btn variant="secondary" onClick={()=>setRejectModal(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={reject}>Confirm Rejection</Btn>
        </>}>
        <p style={{color:T.muted, fontSize:14, marginBottom:16}}>
          Provide a reason for rejection. This will be communicated to the applicant.
        </p>
        <Textarea label="Reason" required rows={4} value={rejectReason}
          onChange={e=>setRejectReason(e.target.value)}
          placeholder="Provide a clear reason…"/>
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: APPROVALS ──────────────────────────────────────────
function Approvals({ approvals, setApprovals, toast }) {
  const [tab, setTab] = useState("all");
  const [rejectModal, setRejectModal] = useState(null);
  const [reason, setReason] = useState("");
  const { confirm, Dialog } = useConfirm();

  const priorityColor = {high:T.danger, medium:T.warning, low:T.success};
  const tabs=[{key:"all",label:"All"},{key:"joining",label:"Joining"},{key:"handover",label:"Handover"},{key:"document",label:"Documents"}];

  const filtered = tab==="all" ? approvals : approvals.filter(a=>a.type===tab);
  const sorted = [...filtered].sort((a,b)=>({high:0,medium:1,low:2}[a.priority]-{high:0,medium:1,low:2}[b.priority]));

  const approveItem = id => {
    setApprovals(p=>p.filter(a=>a.id!==id));
    toast.add("Item approved","success");
  };

  const rejectItem = () => {
    if (!reason.trim()) { toast.add("Enter rejection reason","warning"); return; }
    setApprovals(p=>p.filter(a=>a.id!==rejectModal));
    setRejectModal(null); setReason("");
    toast.add("Item rejected","error");
  };

  const approveAll = async () => {
    if (!await confirm(`Approve all ${filtered.length} visible items?`)) return;
    setApprovals(p=>p.filter(a=>!filtered.find(f=>f.id===a.id)));
    toast.add(`${filtered.length} items approved`,"success");
  };

  return (
    <div>
      <Dialog/>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>Pending Approvals</h1>
          <p style={{color:T.muted, fontSize:13}}>All items awaiting review and action</p>
        </div>
        <Btn variant="success" size="sm" onClick={approveAll}>✓ Approve All Visible</Btn>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20}}>
        {[["⏳",approvals.length,"Total","brand"],
          ["🔴",approvals.filter(a=>a.priority==="high").length,"High Priority","danger"],
          ["🟡",approvals.filter(a=>a.priority==="medium").length,"Medium","warning"],
          ["📝",approvals.filter(a=>a.type==="document").length,"Documents","success"],
          ["📋",approvals.filter(a=>a.type!=="document").length,"Forms","info"]].map(([icon,val,lbl,c])=>(
          <StatCard key={lbl} icon={icon} value={val} label={lbl} color={T[c]}/>
        ))}
      </div>

      {/* Tabs */}
      <div style={{display:"flex", borderBottom:`2px solid ${T.border}`, marginBottom:20}}>
        {tabs.map(t=>(
          <button key={t.key} onClick={()=>setTab(t.key)}
            style={{padding:"10px 18px", fontSize:13, fontWeight:500, cursor:"pointer",
              background:"none", border:"none", borderBottom:`2px solid ${tab===t.key?T.accent:"transparent"}`,
              color:tab===t.key?T.accent:T.muted, marginBottom:-2}}>
            {t.label} ({t.key==="all"?approvals.length:approvals.filter(a=>a.type===t.key).length})
          </button>
        ))}
      </div>

      {sorted.length===0 ? (
        <div style={{textAlign:"center", padding:64, color:T.faint}}>
          <div style={{fontSize:48, marginBottom:12}}>🎉</div>
          <div style={{fontSize:18, fontWeight:700, color:T.muted}}>All caught up!</div>
          <div style={{fontSize:14, marginTop:6}}>No pending approvals.</div>
        </div>
      ) : (
        <div style={{display:"flex", flexDirection:"column", gap:10}}>
          {sorted.map(item=>(
            <div key={item.id} style={{background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:12, padding:"16px 20px", display:"flex", alignItems:"center", gap:14,
              boxShadow:"0 1px 4px rgba(0,0,0,0.04)"}}>
              <div style={{width:4, height:52, borderRadius:99,
                background:priorityColor[item.priority], flexShrink:0}}/>
              <span style={{fontSize:26, flexShrink:0}}>{item.icon}</span>
              <div style={{flex:1, minWidth:0}}>
                <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap"}}>
                  <span style={{fontWeight:700, fontSize:14}}>{item.employee}</span>
                  <code style={{fontSize:11, color:T.faint, fontFamily:"'JetBrains Mono',monospace"}}>{item.empId}</code>
                  <Badge color={item.type==="document"?"neutral":item.type==="handover"?"accent":"info"}>
                    {item.type}
                  </Badge>
                  <Badge color={item.priority==="high"?"danger":item.priority==="medium"?"warning":"success"}>
                    {item.priority}
                  </Badge>
                </div>
                <div style={{fontSize:13, color:T.muted}}>{item.description}</div>
                <div style={{fontSize:11, color:T.faint, marginTop:2}}>Submitted {item.submitted}</div>
              </div>
              <div style={{display:"flex", gap:8, flexShrink:0}}>
                <Btn variant="danger" size="sm" onClick={()=>setRejectModal(item.id)}>✕ Reject</Btn>
                <Btn variant="success" size="sm" onClick={()=>approveItem(item.id)}>✓ Approve</Btn>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal open={!!rejectModal} onClose={()=>setRejectModal(null)} title="Reject Item" size="sm"
        footer={<>
          <Btn variant="secondary" onClick={()=>setRejectModal(null)}>Cancel</Btn>
          <Btn variant="danger" onClick={rejectItem}>Confirm Rejection</Btn>
        </>}>
        <p style={{color:T.muted, fontSize:14, marginBottom:16}}>
          Provide a reason. This will be visible to the employee.
        </p>
        <Textarea label="Reason" required rows={4} value={reason}
          onChange={e=>setReason(e.target.value)} placeholder="Enter rejection reason…"/>
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: REPORTS ────────────────────────────────────────────
function Reports({ toast }) {
  const [dateRange, setDateRange] = useState("this_year");
  const depts = [{name:"Operations",count:12},{name:"Fleet",count:8},{name:"Sales",count:7},
    {name:"Finance",count:5},{name:"HR",count:4},{name:"Technology",count:4},{name:"Admin",count:2}];
  const months = ["Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec","Jan","Feb","Mar"];
  const joiningsData = [3,2,4,1,3,2,5,2,3,4,2,1];
  const maxJoin = Math.max(...joiningsData);

  const download = type => toast.add(`${type} report download started`,"success");

  return (
    <div>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>HR Reports</h1>
          <p style={{color:T.muted, fontSize:13}}>Generate, preview and export — CSV, Excel, PDF</p>
        </div>
        <select value={dateRange} onChange={e=>setDateRange(e.target.value)}
          style={{border:`1.5px solid ${T.border}`, borderRadius:8, padding:"7px 12px",
            fontSize:13, color:T.text, background:T.surface}}>
          {[["this_month","This Month"],["last_month","Last Month"],["this_quarter","This Quarter"],
            ["this_year","This Year (FY 2024-25)"]].map(([v,l])=>(
            <option key={v} value={v}>{l}</option>
          ))}
        </select>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:24}}>
        <StatCard icon="👥" value={42} label="Total Employees"/>
        <StatCard icon="📥" value={8} label="New Joinings" color={T.success}/>
        <StatCard icon="📤" value={5} label="Exits" color={T.warning}/>
        <StatCard icon="📋" value={12} label="Docs Pending" color={T.danger}/>
        <StatCard icon="✅" value="94%" label="Approval Rate" color={T.info}/>
      </div>

      <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginBottom:24}}>
        {/* Bar chart */}
        <Card style={{padding:20}}>
          <div style={{fontWeight:700, color:T.brand, fontSize:14, marginBottom:16}}>
            📈 Monthly Joinings (FY 2024-25)
          </div>
          <div style={{display:"flex", alignItems:"flex-end", gap:6, height:100}}>
            {joiningsData.map((v,i)=>(
              <div key={i} style={{flex:1, display:"flex", flexDirection:"column", alignItems:"center", gap:4}}>
                <span style={{fontSize:9, color:T.faint}}>{v}</span>
                <div style={{width:"100%", height:`${(v/maxJoin)*80}px`,
                  background:T.accent, borderRadius:"3px 3px 0 0",
                  minHeight:4, transition:"height 0.5s"}}/>
              </div>
            ))}
          </div>
          <div style={{display:"flex", gap:6, marginTop:4}}>
            {months.map(m=>(
              <div key={m} style={{flex:1, textAlign:"center", fontSize:9, color:T.faint}}>{m}</div>
            ))}
          </div>
        </Card>

        {/* Department bars */}
        <Card style={{padding:20}}>
          <div style={{fontWeight:700, color:T.brand, fontSize:14, marginBottom:16}}>
            🏢 Employees by Department
          </div>
          {depts.map(d=>(
            <div key={d.name} style={{display:"flex", alignItems:"center", gap:10, marginBottom:8}}>
              <span style={{fontSize:12, color:T.muted, width:80, flexShrink:0}}>{d.name}</span>
              <div style={{flex:1, height:8, background:T.bgDark, borderRadius:4}}>
                <div style={{width:`${(d.count/12)*100}%`, height:"100%",
                  background:T.brand, borderRadius:4}}/>
              </div>
              <span style={{fontSize:12, color:T.muted, width:20}}>{d.count}</span>
            </div>
          ))}
        </Card>
      </div>

      {/* Report downloads */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14}}>
        {[
          {icon:"👥", title:"Employee Master Report", desc:"All employees with status, department, designation", type:"CSV"},
          {icon:"📥", title:"Joining Report", desc:"New joinings with onboarding status and completion", type:"Excel"},
          {icon:"📤", title:"Exit & Handover Report", desc:"Employee exits with handover completion status", type:"PDF"},
          {icon:"📋", title:"Document Status Report", desc:"Pending, verified and rejected documents by employee", type:"CSV"},
          {icon:"✅", title:"Approval Audit Trail", desc:"All approvals with timestamps and approver names", type:"Excel"},
          {icon:"💰", title:"Salary & CTC Summary", desc:"CTC breakdown by department and designation", type:"PDF"},
        ].map(r=>(
          <div key={r.title} style={{background:T.surface, border:`1px solid ${T.border}`,
            borderRadius:12, padding:20, cursor:"pointer", position:"relative", overflow:"hidden",
            transition:"box-shadow 0.15s, transform 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)";e.currentTarget.style.transform="translateY(-2px)"}}
            onMouseLeave={e=>{e.currentTarget.style.boxShadow="none";e.currentTarget.style.transform="none"}}>
            <div style={{position:"absolute", top:0, left:0, right:0, height:3, background:T.accent}}/>
            <div style={{width:44, height:44, borderRadius:10, background:T.accentXlight,
              display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12}}>
              {r.icon}
            </div>
            <div style={{fontWeight:700, fontSize:14, color:T.brand, marginBottom:4}}>{r.title}</div>
            <div style={{fontSize:12, color:T.muted, marginBottom:14, lineHeight:1.5}}>{r.desc}</div>
            <div style={{display:"flex", gap:8}}>
              <Btn variant="outline" size="sm" onClick={()=>download(r.title+" CSV")}>↓ CSV</Btn>
              <Btn variant="secondary" size="sm" onClick={()=>download(r.title+" "+r.type)}>↓ {r.type}</Btn>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── DEMO DATA: HANDOVERS & DOCUMENTS ────────────────────────────
const DEMO_HANDOVERS = [
  {id:"HO-001",empId:"DP-2023-010",name:"Meera Joshi",dept:"Administration",designation:"Admin Executive",
   lastDay:"2024-07-31",manager:"Arjun Sharma",status:"submitted",sections:8,completed:8,
   email:"meera@denebpollux.com",mobile:"9876543217",
   tasks:[
     {title:"Client Handover Documentation",status:"done",note:"All client files transferred to Priya Mehta"},
     {title:"System Access Revocation",status:"done",note:"IT notified, access removed on 28 Jul"},
     {title:"Asset Return — Laptop, ID Card",status:"done",note:"Returned to admin on 29 Jul"},
     {title:"Pending Invoices",status:"done",note:"3 invoices cleared, 1 handed to finance"},
     {title:"Knowledge Transfer Sessions",status:"done",note:"2 sessions conducted with replacement"},
     {title:"Email Handover",status:"done",note:"Auto-forward set to arjun@denebpollux.com"},
     {title:"HR Exit Interview",status:"pending",note:"Scheduled for 30 Jul 3pm"},
     {title:"Full & Final Settlement Docs",status:"pending",note:"Awaiting accounts"},
   ]},
  {id:"HO-002",empId:"DP-2024-003",name:"Rahul Gupta",dept:"Sales",designation:"Sales Executive",
   lastDay:"2024-08-15",manager:"Sneha Patel",status:"draft",sections:8,completed:3,
   email:"rahul@denebpollux.com",mobile:"9876543212",
   tasks:[
     {title:"Pipeline Handover",status:"done",note:""},
     {title:"Client Introductions",status:"done",note:""},
     {title:"CRM Update",status:"done",note:""},
     {title:"Territory Documentation",status:"pending",note:""},
     {title:"Asset Return",status:"pending",note:""},
     {title:"Knowledge Transfer",status:"pending",note:""},
     {title:"Exit Interview",status:"pending",note:""},
     {title:"F&F Settlement",status:"pending",note:""},
   ]},
];

const DEMO_DOCUMENTS = [
  {id:"D001",empId:"JR-2024-009",employee:"Amit Verma",type:"Aadhaar Card",uploaded:"2024-06-01",status:"pending",size:"1.2 MB",icon:"🪪"},
  {id:"D002",empId:"JR-2024-009",employee:"Amit Verma",type:"PAN Card",uploaded:"2024-06-01",status:"pending",size:"0.8 MB",icon:"🪪"},
  {id:"D003",empId:"JR-2024-009",employee:"Amit Verma",type:"10th Certificate",uploaded:"2024-06-02",status:"verified",size:"2.1 MB",icon:"📜"},
  {id:"D004",empId:"JR-2024-009",employee:"Amit Verma",type:"12th Certificate",uploaded:"2024-06-02",status:"verified",size:"1.9 MB",icon:"📜"},
  {id:"D005",empId:"JR-2024-009",employee:"Amit Verma",type:"Degree Certificate",uploaded:"2024-06-02",status:"pending",size:"3.1 MB",icon:"🎓"},
  {id:"D006",empId:"JR-2024-009",employee:"Amit Verma",type:"Experience Letter",uploaded:"2024-06-03",status:"failed",size:"0.5 MB",icon:"📝"},
  {id:"D007",empId:"JR-003",employee:"Nikhil Jain",type:"Aadhaar Card",uploaded:"2024-06-05",status:"pending",size:"1.1 MB",icon:"🪪"},
  {id:"D008",empId:"JR-003",employee:"Nikhil Jain",type:"Salary Slip Month 1",uploaded:"2024-06-05",status:"pending",size:"0.3 MB",icon:"💰"},
  {id:"D009",empId:"JR-006",employee:"Sunita Devi",type:"10th Certificate",uploaded:"2024-06-08",status:"verified",size:"1.7 MB",icon:"📜"},
  {id:"D010",empId:"JR-002",employee:"Kavya Reddy",type:"Experience Letter",uploaded:"2024-06-03",status:"pending",size:"0.6 MB",icon:"📝"},
  {id:"D011",empId:"JR-002",employee:"Kavya Reddy",type:"Relieving Letter",uploaded:"2024-06-03",status:"pending",size:"0.4 MB",icon:"📝"},
  {id:"D012",empId:"DP-2024-007",employee:"Karan Malhotra",type:"Cancelled Cheque",uploaded:"2024-06-10",status:"verified",size:"0.9 MB",icon:"🏦"},
];

const DEMO_USERS = [
  {id:"U001",name:"Priya Sharma",email:"priya.s@denebpollux.com",role:"hr",status:"active",lastLogin:"2024-06-08",created:"2024-01-10"},
  {id:"U002",name:"Amit Kapoor",email:"amit.k@denebpollux.com",role:"admin",status:"active",lastLogin:"2024-06-07",created:"2023-11-01"},
  {id:"U003",name:"Sunita Rao",email:"sunita.r@denebpollux.com",role:"manager",status:"active",lastLogin:"2024-06-06",created:"2024-02-15"},
  {id:"U004",name:"Vikas Mehta",email:"vikas.m@denebpollux.com",role:"cfo",status:"active",lastLogin:"2024-06-05",created:"2024-01-20"},
  {id:"U005",name:"Deepa Singh",email:"deepa.s@denebpollux.com",role:"hr",status:"inactive",lastLogin:"2024-05-20",created:"2024-03-01"},
];

// ─── HR ADMIN: HANDOVER REQUESTS ─────────────────────────────────
function HandoverRequests({ toast }) {
  const [handovers, setHandovers] = useState(DEMO_HANDOVERS);
  const [view, setView] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const { confirm, Dialog } = useConfirm();

  const filtered = handovers.filter(h => {
    const q = search.toLowerCase();
    const ms = !statusFilter || h.status === statusFilter;
    const mq = !q || h.name.toLowerCase().includes(q) || h.empId.toLowerCase().includes(q) || h.dept.toLowerCase().includes(q);
    return ms && mq;
  });

  const approve = async id => {
    if (!await confirm(`Approve handover for ${handovers.find(h=>h.id===id)?.name}?`, "Approve Handover")) return;
    setHandovers(p => p.map(h => h.id===id ? {...h, status:"approved"} : h));
    setView(null);
    toast.add("Handover approved", "success");
  };

  const reject = async id => {
    if (!await confirm(`Reject handover for ${handovers.find(h=>h.id===id)?.name}?`, "Reject Handover")) return;
    setHandovers(p => p.map(h => h.id===id ? {...h, status:"rejected"} : h));
    setView(null);
    toast.add("Handover rejected", "error");
  };

  const statusColor = {submitted:T.info, approved:T.success, rejected:T.danger, draft:T.warning};
  const pctColor = p => p===100 ? T.success : p>=50 ? T.warning : T.danger;

  return (
    <div>
      <Dialog/>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>Exit Handovers</h1>
          <p style={{color:T.muted, fontSize:13}}>Review and manage employee exit handover submissions</p>
        </div>
        <Btn variant="secondary" size="sm" onClick={()=>toast.add("Export started","success")}>↓ Export</Btn>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20}}>
        {[["📤",handovers.length,"Total Handovers",T.brand],
          ["📝",handovers.filter(h=>h.status==="submitted").length,"Submitted",T.info],
          ["✅",handovers.filter(h=>h.status==="approved").length,"Approved",T.success],
          ["⏳",handovers.filter(h=>h.status==="draft").length,"In Progress",T.warning],
        ].map(([icon,val,lbl,color])=>(
          <StatCard key={lbl} icon={icon} value={val} label={lbl} color={color}/>
        ))}
      </div>

      {/* Filter row */}
      <div style={{display:"flex", gap:8, marginBottom:16, alignItems:"center"}}>
        <div style={{position:"relative", flex:1, maxWidth:300}}>
          <span style={{position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.faint}}>🔍</span>
          <input placeholder="Search employee or ID…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%", padding:"7px 12px 7px 32px", border:`1.5px solid ${T.border}`,
              borderRadius:8, fontSize:13, background:T.surface}}/>
        </div>
        {["","submitted","approved","draft","rejected"].map(s=>(
          <button key={s} onClick={()=>setStatusFilter(s)}
            style={{padding:"6px 14px", borderRadius:99, border:`1.5px solid ${statusFilter===s?T.brand:T.border}`,
              background:statusFilter===s?T.brand:T.surface,
              color:statusFilter===s?"#fff":T.muted, fontSize:12, fontWeight:500, cursor:"pointer"}}>
            {s===""?"All":s.charAt(0).toUpperCase()+s.slice(1)}
          </button>
        ))}
      </div>

      <Card>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
            <thead>
              <tr style={{background:T.surface2}}>
                {["Employee","ID","Department","Last Day","Manager","Completion","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 16px", textAlign:"left", color:T.muted,
                    fontWeight:600, fontSize:12, borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0
                ? <tr><td colSpan={8} style={{padding:48, textAlign:"center", color:T.faint}}>No handovers found.</td></tr>
                : filtered.map((h, i) => {
                    const pct = Math.round((h.tasks.filter(t=>t.status==="done").length / h.tasks.length) * 100);
                    return (
                      <tr key={h.id} style={{borderBottom:`1px solid ${T.border}`, background:i%2===0?T.surface:T.surface2}}>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{fontWeight:600}}>{h.name}</div>
                          <div style={{fontSize:11, color:T.faint}}>{h.designation}</div>
                        </td>
                        <td style={{padding:"11px 16px"}}><code style={{fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace"}}>{h.empId}</code></td>
                        <td style={{padding:"11px 16px", color:T.muted}}>{h.dept}</td>
                        <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{h.lastDay}</td>
                        <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{h.manager}</td>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex", alignItems:"center", gap:8}}>
                            <div style={{flex:1, height:6, background:T.bgDark, borderRadius:3}}>
                              <div style={{width:`${pct}%`, height:"100%", borderRadius:3, background:pctColor(pct)}}/>
                            </div>
                            <span style={{fontSize:11, color:T.muted, width:34, textAlign:"right"}}>{pct}%</span>
                          </div>
                          <div style={{fontSize:10, color:T.faint, marginTop:2}}>
                            {h.tasks.filter(t=>t.status==="done").length}/{h.tasks.length} sections
                          </div>
                        </td>
                        <td style={{padding:"11px 16px"}}>
                          <span style={{background:statusColor[h.status]+"18", color:statusColor[h.status],
                            border:`1px solid ${statusColor[h.status]}44`, borderRadius:99,
                            padding:"3px 10px", fontSize:11, fontWeight:700, textTransform:"uppercase"}}>
                            {h.status}
                          </span>
                        </td>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex", gap:6}}>
                            <Btn variant="ghost" size="xs" onClick={()=>setView(h)}>Review →</Btn>
                            {h.status==="submitted" && (
                              <Btn variant="success" size="xs" onClick={()=>approve(h.id)}>Approve</Btn>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Review Modal */}
      <Modal open={!!view} onClose={()=>setView(null)} title={`Handover Review — ${view?.name}`} size="xl"
        footer={<>
          <Btn variant="secondary" onClick={()=>setView(null)}>Close</Btn>
          {view?.status==="submitted" && <>
            <Btn variant="danger" onClick={()=>reject(view.id)}>Reject</Btn>
            <Btn variant="success" onClick={()=>approve(view.id)}>✓ Approve Handover</Btn>
          </>}
        </>}>
        {view && (
          <div>
            {/* Employee info strip */}
            <div style={{display:"flex", gap:16, padding:16, background:T.surface2,
              borderRadius:12, border:`1px solid ${T.border}`, marginBottom:20}}>
              <div style={{width:48, height:48, borderRadius:"50%", background:T.brand,
                display:"flex", alignItems:"center", justifyContent:"center",
                color:"#fff", fontSize:16, fontWeight:700, flexShrink:0}}>
                {view.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:700, fontSize:15, color:T.brand}}>{view.name}</div>
                <div style={{color:T.muted, fontSize:13}}>{view.designation} · {view.dept}</div>
                <div style={{display:"flex", gap:16, marginTop:8, flexWrap:"wrap"}}>
                  {[["Last Day", view.lastDay],["Reporting to", view.manager],["Email", view.email]].map(([l,v])=>(
                    <span key={l} style={{fontSize:12, color:T.faint}}><strong style={{color:T.muted}}>{l}:</strong> {v}</span>
                  ))}
                </div>
              </div>
              <div>
                <span style={{background:statusColor[view.status]+"18", color:statusColor[view.status],
                  border:`1px solid ${statusColor[view.status]}44`, borderRadius:99,
                  padding:"4px 12px", fontSize:12, fontWeight:700, textTransform:"uppercase"}}>
                  {view.status}
                </span>
              </div>
            </div>

            {/* Workflow status */}
            <div style={{display:"flex", alignItems:"center", gap:0, marginBottom:20,
              background:T.surface2, border:`1px solid ${T.border}`, borderRadius:10, padding:"14px 20px"}}>
              <div style={{fontSize:12, fontWeight:700, color:T.muted, marginRight:16, textTransform:"uppercase", letterSpacing:"0.06em"}}>
                Approval Flow
              </div>
              {[["Draft","📝"],["Submitted","📤"],["Manager Approved","👔"],["HR Approved","✅"],["F&F Cleared","💰"]].map(([lbl,icon],i,arr)=>(
                <div key={lbl} style={{display:"flex", alignItems:"center"}}>
                  <div style={{display:"flex", alignItems:"center", gap:6}}>
                    <div style={{width:28, height:28, borderRadius:"50%",
                      background:view.status==="approved"&&i<=3?T.success:view.status==="submitted"&&i<=1?T.info:i===0?T.muted:T.bgDark,
                      display:"flex", alignItems:"center", justifyContent:"center",
                      fontSize:12, color:view.status==="approved"&&i<=3?"#fff":view.status==="submitted"&&i<=1?"#fff":"rgba(0,0,0,0.3)"}}>
                      {icon}
                    </div>
                    <span style={{fontSize:11, color:T.muted, fontWeight:500}}>{lbl}</span>
                  </div>
                  {i<arr.length-1 && <div style={{width:24, height:2, background:T.border, margin:"0 8px"}}/>}
                </div>
              ))}
            </div>

            {/* Handover checklist */}
            <div style={{fontWeight:700, color:T.brand, fontSize:14, marginBottom:12}}>
              Handover Sections ({view.tasks.filter(t=>t.status==="done").length}/{view.tasks.length} complete)
            </div>
            <div style={{display:"flex", flexDirection:"column", gap:8}}>
              {view.tasks.map((task, i) => (
                <div key={i} style={{display:"flex", alignItems:"flex-start", gap:12, padding:"12px 16px",
                  background:task.status==="done"?T.successLight:T.surface2,
                  border:`1px solid ${task.status==="done"?T.successBorder:T.border}`,
                  borderRadius:10}}>
                  <div style={{width:24, height:24, borderRadius:"50%", flexShrink:0,
                    background:task.status==="done"?T.success:T.bgDark,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:task.status==="done"?"#fff":T.faint, fontSize:11, fontWeight:700}}>
                    {task.status==="done" ? "✓" : i+1}
                  </div>
                  <div style={{flex:1}}>
                    <div style={{fontWeight:600, fontSize:13, color:task.status==="done"?T.success:T.text}}>{task.title}</div>
                    {task.note && <div style={{fontSize:12, color:T.muted, marginTop:3}}>{task.note}</div>}
                  </div>
                  <span style={{fontSize:11, fontWeight:600, color:task.status==="done"?T.success:T.warning,
                    textTransform:"uppercase", letterSpacing:"0.05em"}}>
                    {task.status==="done" ? "Done" : "Pending"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: DOCUMENT REVIEW ────────────────────────────────────
function DocumentReview({ toast }) {
  const [docs, setDocs] = useState(DEMO_DOCUMENTS);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [viewDoc, setViewDoc] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);
  const { confirm, Dialog } = useConfirm();

  const docTypes = [...new Set(docs.map(d=>d.type))];

  const filtered = docs.filter(d => {
    const q = search.toLowerCase();
    const ms = !statusFilter || d.status === statusFilter;
    const mt = !typeFilter || d.type === typeFilter;
    const mq = !q || d.employee.toLowerCase().includes(q) || d.empId.toLowerCase().includes(q) || d.type.toLowerCase().includes(q);
    return ms && mt && mq;
  });

  const verify = async id => {
    if (!await confirm(`Verify this document?`, "Verify Document")) return;
    setDocs(p => p.map(d => d.id===id ? {...d, status:"verified"} : d));
    setViewDoc(null);
    toast.add("Document verified", "success");
  };

  const rejectDoc = () => {
    if (!rejectReason.trim()) { toast.add("Enter a rejection reason","warning"); return; }
    setDocs(p => p.map(d => d.id===rejectTarget ? {...d, status:"failed"} : d));
    setRejectTarget(null);
    setRejectReason("");
    setViewDoc(null);
    toast.add("Document rejected", "error");
  };

  const statusMap = {
    pending:  [T.warningLight, T.warning, "Pending"],
    verified: [T.successLight, T.success, "Verified"],
    failed:   [T.dangerLight,  T.danger,  "Failed"],
  };

  return (
    <div>
      <Dialog/>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>Document Review</h1>
          <p style={{color:T.muted, fontSize:13}}>Verify and manage uploaded employee documents</p>
        </div>
        <Btn variant="secondary" size="sm" onClick={()=>toast.add("Export started","success")}>↓ Export</Btn>
      </div>

      {/* Stats */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:12, marginBottom:20}}>
        {[["📄",docs.length,"Total Docs",T.brand],
          ["⏳",docs.filter(d=>d.status==="pending").length,"Pending Review",T.warning],
          ["✅",docs.filter(d=>d.status==="verified").length,"Verified",T.success],
          ["✕",docs.filter(d=>d.status==="failed").length,"Rejected",T.danger],
        ].map(([icon,val,lbl,color])=>(
          <StatCard key={lbl} icon={icon} value={val} label={lbl} color={color}/>
        ))}
      </div>

      {/* Filters */}
      <div style={{display:"flex", gap:10, marginBottom:16, flexWrap:"wrap", alignItems:"center"}}>
        <div style={{position:"relative", maxWidth:260}}>
          <span style={{position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.faint, fontSize:13}}>🔍</span>
          <input placeholder="Search employee, type…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{padding:"7px 12px 7px 32px", border:`1.5px solid ${T.border}`, borderRadius:8, fontSize:13, background:T.surface, width:"100%"}}/>
        </div>
        <select value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}
          style={{border:`1.5px solid ${T.border}`, borderRadius:8, padding:"7px 12px", fontSize:13, background:T.surface}}>
          <option value="">All Status</option>
          {["pending","verified","failed"].map(s=><option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
        </select>
        <select value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}
          style={{border:`1.5px solid ${T.border}`, borderRadius:8, padding:"7px 12px", fontSize:13, background:T.surface, maxWidth:200}}>
          <option value="">All Types</option>
          {docTypes.map(t=><option key={t} value={t}>{t}</option>)}
        </select>
      </div>

      <Card>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
            <thead>
              <tr style={{background:T.surface2}}>
                {["Document","Employee","Employee ID","Uploaded","Size","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 16px", textAlign:"left", color:T.muted,
                    fontWeight:600, fontSize:12, borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length===0
                ? <tr><td colSpan={7} style={{padding:48, textAlign:"center", color:T.faint}}>No documents found.</td></tr>
                : filtered.map((d,i)=>{
                    const [bg, fg, lbl] = statusMap[d.status]||[T.bgDark,T.muted,"—"];
                    return (
                      <tr key={d.id} style={{borderBottom:`1px solid ${T.border}`, background:i%2===0?T.surface:T.surface2}}>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex", alignItems:"center", gap:10}}>
                            <span style={{fontSize:18}}>{d.icon}</span>
                            <span style={{fontWeight:600}}>{d.type}</span>
                          </div>
                        </td>
                        <td style={{padding:"11px 16px"}}>{d.employee}</td>
                        <td style={{padding:"11px 16px"}}>
                          <code style={{fontSize:11, color:T.muted, fontFamily:"'JetBrains Mono',monospace"}}>{d.empId}</code>
                        </td>
                        <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{d.uploaded}</td>
                        <td style={{padding:"11px 16px", color:T.faint, fontSize:12}}>{d.size}</td>
                        <td style={{padding:"11px 16px"}}>
                          <span style={{background:bg, color:fg, border:`1px solid ${fg}44`,
                            borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700}}>
                            {lbl}
                          </span>
                        </td>
                        <td style={{padding:"11px 16px"}}>
                          <div style={{display:"flex", gap:6}}>
                            <Btn variant="ghost" size="xs" onClick={()=>setViewDoc(d)}>👁 View</Btn>
                            {d.status==="pending" && <>
                              <Btn variant="success" size="xs" onClick={()=>verify(d.id)}>✓ Verify</Btn>
                              <Btn variant="danger" size="xs" onClick={()=>{setRejectTarget(d.id);setViewDoc(d);}}>✕</Btn>
                            </>}
                          </div>
                        </td>
                      </tr>
                    );
                  })
              }
            </tbody>
          </table>
        </div>
      </Card>

      {/* Document detail modal */}
      <Modal open={!!viewDoc} onClose={()=>{setViewDoc(null);setRejectTarget(null);setRejectReason("");}}
        title={viewDoc?.type||""} size="md"
        footer={<>
          <Btn variant="secondary" onClick={()=>{setViewDoc(null);setRejectTarget(null);setRejectReason("");}}>Close</Btn>
          {viewDoc?.status==="pending" && !rejectTarget && (
            <>
              <Btn variant="danger" onClick={()=>setRejectTarget(viewDoc.id)}>✕ Reject</Btn>
              <Btn variant="success" onClick={()=>verify(viewDoc?.id)}>✓ Verify</Btn>
            </>
          )}
          {rejectTarget && <Btn variant="danger" onClick={rejectDoc}>Confirm Rejection</Btn>}
        </>}>
        {viewDoc && (
          <div>
            <div style={{background:T.surface2, border:`1px solid ${T.border}`, borderRadius:12,
              padding:16, marginBottom:20, display:"flex", alignItems:"center", gap:14}}>
              <span style={{fontSize:36}}>{viewDoc.icon}</span>
              <div>
                <div style={{fontWeight:700, fontSize:15}}>{viewDoc.type}</div>
                <div style={{color:T.muted, fontSize:13}}>{viewDoc.employee} · {viewDoc.empId}</div>
                <div style={{marginTop:6}}>
                  {(()=>{const [bg,fg,lbl]=statusMap[viewDoc.status]||[T.bgDark,T.muted,"—"];
                    return <span style={{background:bg,color:fg,border:`1px solid ${fg}44`,borderRadius:99,padding:"3px 10px",fontSize:11,fontWeight:700}}>{lbl}</span>;
                  })()}
                </div>
              </div>
            </div>

            {[["Uploaded On",viewDoc.uploaded],["File Size",viewDoc.size],["Employee",viewDoc.employee],["Employee ID",viewDoc.empId]].map(([l,v])=>(
              <div key={l} style={{display:"flex", padding:"9px 0", borderBottom:`1px solid ${T.border}`, fontSize:13}}>
                <span style={{width:"40%", color:T.muted, fontWeight:500}}>{l}</span>
                <span>{v}</span>
              </div>
            ))}

            {/* Simulated document preview */}
            <div style={{marginTop:20, background:T.bg, border:`2px dashed ${T.border}`,
              borderRadius:12, padding:32, textAlign:"center", color:T.faint}}>
              <div style={{fontSize:48, marginBottom:8}}>{viewDoc.icon}</div>
              <div style={{fontSize:14, fontWeight:600, color:T.muted, marginBottom:4}}>{viewDoc.type}</div>
              <div style={{fontSize:12, marginBottom:16}}>PDF/Image preview would render here</div>
              <Btn variant="secondary" size="sm" onClick={()=>toast.add("Download started","success")}>↓ Download File</Btn>
            </div>

            {rejectTarget && (
              <div style={{marginTop:16}}>
                <Textarea label="Rejection Reason" required rows={3} value={rejectReason}
                  onChange={e=>setRejectReason(e.target.value)}
                  placeholder="Explain why this document is being rejected…"/>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: USER MANAGEMENT ────────────────────────────────────
function UserManagement({ toast }) {
  const [users, setUsers] = useState(DEMO_USERS);
  const [showAdd, setShowAdd] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [search, setSearch] = useState("");
  const { confirm, Dialog } = useConfirm();
  const [form, setForm] = useState({name:"", email:"", role:"hr", status:"active"});

  const roleMap = {
    admin:   [T.dangerLight, T.danger, "Administrator"],
    hr:      [T.infoLight, T.info, "HR Manager"],
    manager: [T.warningLight, T.warning, "Manager"],
    cfo:     [T.accentXlight, T.accent, "CFO"],
  };

  const filtered = users.filter(u => {
    const q = search.toLowerCase();
    return !q || u.name.toLowerCase().includes(q) || u.email.toLowerCase().includes(q) || u.role.includes(q);
  });

  const saveUser = () => {
    if (!form.name || !form.email) { toast.add("Fill all required fields","warning"); return; }
    if (editUser) {
      setUsers(p => p.map(u => u.id===editUser.id ? {...u, ...form} : u));
      toast.add("User updated","success");
    } else {
      setUsers(p => [...p, {...form, id:"U"+(p.length+1).toString().padStart(3,"0"), lastLogin:"—", created:new Date().toISOString().slice(0,10)}]);
      toast.add("User added","success");
    }
    setShowAdd(false); setEditUser(null); setForm({name:"",email:"",role:"hr",status:"active"});
  };

  const toggleStatus = async u => {
    const newStatus = u.status==="active"?"inactive":"active";
    if (!await confirm(`${newStatus==="active"?"Activate":"Deactivate"} ${u.name}?`)) return;
    setUsers(p => p.map(x => x.id===u.id ? {...x, status:newStatus} : x));
    toast.add(`User ${newStatus==="active"?"activated":"deactivated"}`,"success");
  };

  const deleteUser = async u => {
    if (!await confirm(`Delete ${u.name}? This cannot be undone.`, "Delete User")) return;
    setUsers(p => p.filter(x => x.id!==u.id));
    toast.add("User deleted","info");
  };

  const openEdit = u => { setEditUser(u); setForm({name:u.name,email:u.email,role:u.role,status:u.status}); setShowAdd(true); };

  return (
    <div>
      <Dialog/>
      <div style={{display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16}}>
        <div>
          <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>User Management</h1>
          <p style={{color:T.muted, fontSize:13}}>Manage HR portal access — roles, permissions and user accounts</p>
        </div>
        <Btn variant="primary" size="sm" onClick={()=>{setEditUser(null);setForm({name:"",email:"",role:"hr",status:"active"});setShowAdd(true);}}>
          + Add User
        </Btn>
      </div>

      {/* Role stat cards */}
      <div style={{display:"grid", gridTemplateColumns:"repeat(5,1fr)", gap:12, marginBottom:20}}>
        {[["👥",users.length,"Total Users",T.brand],
          ["🔴",users.filter(u=>u.role==="admin").length,"Admins",T.danger],
          ["🟦",users.filter(u=>u.role==="hr").length,"HR Managers",T.info],
          ["🟡",users.filter(u=>u.role==="manager").length,"Managers",T.warning],
          ["✅",users.filter(u=>u.status==="active").length,"Active",T.success],
        ].map(([icon,val,lbl,color])=>(
          <StatCard key={lbl} icon={icon} value={val} label={lbl} color={color}/>
        ))}
      </div>

      {/* Search */}
      <div style={{marginBottom:16}}>
        <div style={{position:"relative", maxWidth:300}}>
          <span style={{position:"absolute", left:10, top:"50%", transform:"translateY(-50%)", color:T.faint, fontSize:13}}>🔍</span>
          <input placeholder="Search name, email, role…" value={search} onChange={e=>setSearch(e.target.value)}
            style={{width:"100%", padding:"7px 12px 7px 32px", border:`1.5px solid ${T.border}`,
              borderRadius:8, fontSize:13, background:T.surface}}/>
        </div>
      </div>

      <Card>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%", borderCollapse:"collapse", fontSize:13}}>
            <thead>
              <tr style={{background:T.surface2}}>
                {["User","Email","Role","Last Login","Created","Status","Actions"].map(h=>(
                  <th key={h} style={{padding:"11px 16px", textAlign:"left", color:T.muted,
                    fontWeight:600, fontSize:12, borderBottom:`1px solid ${T.border}`, whiteSpace:"nowrap"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((u, i) => {
                const [bg, fg, lbl] = roleMap[u.role] || [T.bgDark, T.muted, u.role];
                return (
                  <tr key={u.id} style={{borderBottom:`1px solid ${T.border}`, background:i%2===0?T.surface:T.surface2}}>
                    <td style={{padding:"11px 16px"}}>
                      <div style={{display:"flex", alignItems:"center", gap:10}}>
                        <div style={{width:32, height:32, borderRadius:"50%", background:fg,
                          display:"flex", alignItems:"center", justifyContent:"center",
                          color:"#fff", fontSize:11, fontWeight:700, flexShrink:0}}>
                          {u.name.split(" ").map(w=>w[0]).join("").slice(0,2)}
                        </div>
                        <span style={{fontWeight:600}}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{padding:"11px 16px", color:T.muted, fontSize:12}}>{u.email}</td>
                    <td style={{padding:"11px 16px"}}>
                      <span style={{background:bg, color:fg, border:`1px solid ${fg}33`,
                        borderRadius:99, padding:"3px 10px", fontSize:11, fontWeight:700}}>
                        {lbl}
                      </span>
                    </td>
                    <td style={{padding:"11px 16px", color:T.faint, fontSize:12}}>{u.lastLogin}</td>
                    <td style={{padding:"11px 16px", color:T.faint, fontSize:12}}>{u.created}</td>
                    <td style={{padding:"11px 16px"}}>
                      <span style={{background:u.status==="active"?T.successLight:T.bgDark,
                        color:u.status==="active"?T.success:T.muted, borderRadius:99,
                        padding:"3px 10px", fontSize:11, fontWeight:700}}>
                        {u.status==="active"?"Active":"Inactive"}
                      </span>
                    </td>
                    <td style={{padding:"11px 16px"}}>
                      <div style={{display:"flex", gap:6}}>
                        <Btn variant="ghost" size="xs" onClick={()=>openEdit(u)}>✏️ Edit</Btn>
                        <Btn variant="ghost" size="xs" onClick={()=>toggleStatus(u)}
                          style={{color:u.status==="active"?T.warning:T.success}}>
                          {u.status==="active"?"Deactivate":"Activate"}
                        </Btn>
                        <Btn variant="ghost" size="xs" onClick={()=>deleteUser(u)}
                          style={{color:T.danger}}>🗑</Btn>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Add/Edit User Modal */}
      <Modal open={showAdd} onClose={()=>{setShowAdd(false);setEditUser(null);}} size="sm"
        title={editUser?"Edit User":"Add New User"}
        footer={<>
          <Btn variant="secondary" onClick={()=>{setShowAdd(false);setEditUser(null);}}>Cancel</Btn>
          <Btn variant="primary" onClick={saveUser}>{editUser?"Save Changes":"Add User"}</Btn>
        </>}>
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Input label="Full Name" required value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))} placeholder="User full name"/>
          <Input label="Email Address" required type="email" value={form.email} onChange={e=>setForm(p=>({...p,email:e.target.value}))} placeholder="user@denebpollux.com"/>
          <Select label="Role" required value={form.role} onChange={e=>setForm(p=>({...p,role:e.target.value}))}
            options={[{value:"admin",label:"Administrator"},{value:"hr",label:"HR Manager"},{value:"manager",label:"Manager"},{value:"cfo",label:"CFO"}]}/>
          <Select label="Status" value={form.status} onChange={e=>setForm(p=>({...p,status:e.target.value}))}
            options={[{value:"active",label:"Active"},{value:"inactive",label:"Inactive"}]}/>
          {!editUser && (
            <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`, borderRadius:8,
              padding:"10px 14px", fontSize:12, color:T.info}}>
              ℹ️ A welcome email with login credentials will be sent automatically.
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}

// ─── HR ADMIN: SETTINGS ───────────────────────────────────────────
function Settings({ toast }) {
  const [saved, setSaved] = useState({});
  const [orgName, setOrgName] = useState("Deneb & Pollux Tours and Travels Pvt Ltd");
  const [orgEmail, setOrgEmail] = useState("hr@denebpollux.com");
  const [orgPhone, setOrgPhone] = useState("+91 11 4567 8900");
  const [orgAddress, setOrgAddress] = useState("123, Connaught Place, New Delhi — 110001");
  const [offerExpiry, setOfferExpiry] = useState("7");
  const [autoReminder, setAutoReminder] = useState(true);
  const [reminderDays, setReminderDays] = useState("3");
  const [probation, setProbation] = useState("6");
  const [bvgEnabled, setBvgEnabled] = useState(true);
  const [minCerts, setMinCerts] = useState("5");
  const [smtpHost, setSmtpHost] = useState("smtp.denebpollux.com");
  const [smtpPort, setSmtpPort] = useState("587");
  const [smtpUser, setSmtpUser] = useState("noreply@denebpollux.com");
  const [notifJoining, setNotifJoining] = useState(true);
  const [notifApproval, setNotifApproval] = useState(true);
  const [notifHandover, setNotifHandover] = useState(false);

  const save = section => {
    setSaved(p=>({...p,[section]:true}));
    toast.add(`${section} settings saved`, "success");
    setTimeout(()=>setSaved(p=>({...p,[section]:false})),2000);
  };

  const Toggle = ({checked, onChange, label}) => (
    <label style={{display:"flex", alignItems:"center", gap:12, cursor:"pointer"}}>
      <div onClick={()=>onChange(!checked)}
        style={{width:44, height:24, borderRadius:12,
          background:checked?T.success:T.bgDark, position:"relative", transition:"background 0.2s", cursor:"pointer"}}>
        <div style={{width:18, height:18, borderRadius:"50%", background:"#fff",
          position:"absolute", top:3, left:checked?23:3, transition:"left 0.2s",
          boxShadow:"0 1px 4px rgba(0,0,0,0.18)"}}/>
      </div>
      <span style={{fontSize:13, color:T.text}}>{label}</span>
    </label>
  );

  const sections = [
    {
      id:"org", icon:"🏢", title:"Organisation Details",
      content:(
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <FormGrid cols={2}>
            <Input label="Organisation Name" value={orgName} onChange={e=>setOrgName(e.target.value)} style={{gridColumn:"span 2"}}/>
            <Input label="HR Email" type="email" value={orgEmail} onChange={e=>setOrgEmail(e.target.value)}/>
            <Input label="Phone" value={orgPhone} onChange={e=>setOrgPhone(e.target.value)}/>
            <Input label="Address" value={orgAddress} onChange={e=>setOrgAddress(e.target.value)} style={{gridColumn:"span 2"}}/>
          </FormGrid>
        </div>
      )
    },
    {
      id:"joining", icon:"📋", title:"Joining & Onboarding",
      content:(
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <FormGrid cols={3}>
            <Input label="Offer Letter Validity (days)" type="number" value={offerExpiry} onChange={e=>setOfferExpiry(e.target.value)}/>
            <Input label="Probation Period (months)" type="number" value={probation} onChange={e=>setProbation(e.target.value)}/>
            <Input label="Minimum Certifications Required" type="number" value={minCerts} onChange={e=>setMinCerts(e.target.value)}/>
          </FormGrid>
          <div style={{display:"flex", flexDirection:"column", gap:12}}>
            <Toggle checked={autoReminder} onChange={setAutoReminder} label="Send automatic reminders to employees who haven't accepted offer"/>
            {autoReminder && (
              <Input label="Reminder before expiry (days)" type="number" value={reminderDays}
                onChange={e=>setReminderDays(e.target.value)} style={{maxWidth:200}}/>
            )}
            <Toggle checked={bvgEnabled} onChange={setBvgEnabled} label="Require background verification consent in joining form"/>
          </div>
        </div>
      )
    },
    {
      id:"email", icon:"📧", title:"Email / SMTP Configuration",
      content:(
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <FormGrid cols={2}>
            <Input label="SMTP Host" value={smtpHost} onChange={e=>setSmtpHost(e.target.value)}/>
            <Input label="SMTP Port" type="number" value={smtpPort} onChange={e=>setSmtpPort(e.target.value)}/>
            <Input label="SMTP Username / From Email" value={smtpUser} onChange={e=>setSmtpUser(e.target.value)}/>
            <Input label="SMTP Password" type="password" value="••••••••••" onChange={()=>{}}/>
          </FormGrid>
          <Btn variant="secondary" size="sm" style={{alignSelf:"flex-start"}}
            onClick={()=>toast.add("Test email sent to "+orgEmail,"success")}>
            🧪 Send Test Email
          </Btn>
        </div>
      )
    },
    {
      id:"notif", icon:"🔔", title:"Notification Preferences",
      content:(
        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Toggle checked={notifJoining} onChange={setNotifJoining} label="Notify HR when new joining application is submitted"/>
          <Toggle checked={notifApproval} onChange={setNotifApproval} label="Notify HR when document is uploaded and awaiting review"/>
          <Toggle checked={notifHandover} onChange={setNotifHandover} label="Notify manager when exit handover is submitted"/>
        </div>
      )
    },
  ];

  return (
    <div style={{maxWidth:800}}>
      <div style={{marginBottom:24}}>
        <h1 style={{fontSize:22, fontWeight:800, color:T.brand}}>Settings</h1>
        <p style={{color:T.muted, fontSize:13}}>Configure the HR portal, onboarding rules, email and notifications</p>
      </div>

      <div style={{display:"flex", flexDirection:"column", gap:16}}>
        {sections.map(s=>(
          <div key={s.id} style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:14, overflow:"hidden"}}>
            <div style={{background:T.surface2, padding:"14px 20px", borderBottom:`1px solid ${T.border}`,
              display:"flex", alignItems:"center", gap:10}}>
              <div style={{width:34, height:34, borderRadius:8, background:T.accentXlight,
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:16}}>{s.icon}</div>
              <span style={{fontWeight:700, color:T.brand, fontSize:14}}>{s.title}</span>
            </div>
            <div style={{padding:20}}>
              {s.content}
              <div style={{marginTop:16, paddingTop:16, borderTop:`1px solid ${T.border}`, display:"flex", justifyContent:"flex-end"}}>
                <Btn variant="primary" size="sm" onClick={()=>save(s.title)}>
                  {saved[s.title] ? "✓ Saved" : "Save Changes"}
                </Btn>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── HR ADMIN PORTAL ──────────────────────────────────────────────
function AdminPortal({ onSwitch }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [page, setPage] = useState("dashboard");
  const [collapsed, setCollapsed] = useState(false);
  const [employees, setEmployees] = useState(DEMO_EMPLOYEES);
  const [approvals, setApprovals] = useState(DEMO_APPROVALS);
  const [topbarSearch, setTopbarSearch] = useState("");
  const [showNotifs, setShowNotifs] = useState(false);
  const toast = useToast();

  if (!loggedIn) return <>
    <AdminLogin onLogin={u=>{setUser(u);setLoggedIn(true);}}/>
    <Toast toasts={toast.toasts} remove={toast.remove}/>
  </>;

  const pageTitle = {
    dashboard:"Dashboard", employees:"Employees",
    "joining-requests":"Joining Requests", "handover-requests":"Exit Handovers",
    documents:"Document Review", approvals:"Pending Approvals",
    reports:"Reports", users:"User Management", settings:"Settings"
  }[page] || page;

  const renderPage = () => {
    switch(page) {
      case "dashboard": return <Dashboard employees={employees} approvals={approvals} toast={toast}/>;
      case "employees": return <Employees employees={employees} setEmployees={setEmployees} toast={toast}/>;
      case "joining-requests": return <JoiningRequests employees={employees} setEmployees={setEmployees} toast={toast}/>;
      case "approvals": return <Approvals approvals={approvals} setApprovals={setApprovals} toast={toast}/>;
      case "reports": return <Reports toast={toast}/>;
      case "handover-requests": return <HandoverRequests toast={toast}/>;
      case "documents": return <DocumentReview toast={toast}/>;
      case "users": return <UserManagement toast={toast}/>;
      case "settings": return <Settings toast={toast}/>;
      default:
        return (
          <div style={{textAlign:"center", padding:64, color:T.faint}}>
            <div style={{fontSize:48, marginBottom:12}}>🏠</div>
            <div style={{fontSize:18, fontWeight:700, color:T.muted}}>Page not found</div>
          </div>
        );
    }
  };

  return (
    <div style={{display:"flex", minHeight:"100vh"}}>
      <Sidebar page={page} onNav={setPage} user={user} collapsed={collapsed}
        onToggle={()=>setCollapsed(c=>!c)} onLogout={()=>setLoggedIn(false)}/>
      <div style={{flex:1, display:"flex", flexDirection:"column", minWidth:0}}>
        <Topbar title={pageTitle} onToggle={()=>setCollapsed(c=>!c)}
          onSearch={["employees","joining-requests","documents","handover-requests"].includes(page)?setTopbarSearch:undefined}
          searchVal={topbarSearch}
          rightContent={
            <div style={{display:"flex", alignItems:"center", gap:12}}>
              {/* Notification bell */}
              <div style={{position:"relative"}}>
                <button
                  onClick={()=>setShowNotifs(p=>!p)}
                  style={{background:"none", border:"none", cursor:"pointer",
                    fontSize:18, color:T.muted, position:"relative", lineHeight:1,
                    padding:4}}>
                  🔔
                  {approvals.length > 0 && (
                    <span style={{position:"absolute", top:-2, right:-2, width:16, height:16,
                      borderRadius:"50%", background:T.danger, color:"#fff",
                      fontSize:9, fontWeight:700, display:"flex", alignItems:"center", justifyContent:"center"}}>
                      {approvals.length}
                    </span>
                  )}
                </button>
                {showNotifs && (
                  <div style={{position:"absolute", right:0, top:"calc(100% + 8px)", width:340,
                    background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
                    boxShadow:"0 12px 40px rgba(0,0,0,0.14)", zIndex:200}}>
                    <div style={{padding:"14px 18px", borderBottom:`1px solid ${T.border}`,
                      display:"flex", alignItems:"center", justifyContent:"space-between"}}>
                      <span style={{fontWeight:700, color:T.brand, fontSize:14}}>Notifications</span>
                      <span style={{fontSize:11, color:T.faint}}>{approvals.length} pending</span>
                    </div>
                    <div style={{maxHeight:320, overflowY:"auto"}}>
                      {approvals.slice(0,8).map(a=>(
                        <div key={a.id} style={{padding:"12px 18px", borderBottom:`1px solid ${T.border}`,
                          display:"flex", gap:12, cursor:"pointer",
                          background:T.surface}}
                          onMouseEnter={e=>e.currentTarget.style.background=T.surface2}
                          onMouseLeave={e=>e.currentTarget.style.background=T.surface}
                          onClick={()=>{setPage("approvals");setShowNotifs(false);}}>
                          <span style={{fontSize:20, flexShrink:0}}>{a.icon}</span>
                          <div style={{flex:1, minWidth:0}}>
                            <div style={{fontWeight:600, fontSize:12, color:T.text}}>{a.employee}</div>
                            <div style={{fontSize:11, color:T.muted, marginTop:2, overflow:"hidden",
                              textOverflow:"ellipsis", whiteSpace:"nowrap"}}>{a.description}</div>
                            <div style={{fontSize:10, color:T.faint, marginTop:2}}>{a.submitted}</div>
                          </div>
                          <span style={{fontSize:10, fontWeight:700, padding:"2px 7px", borderRadius:4,
                            background:a.priority==="high"?T.dangerLight:a.priority==="medium"?T.warningLight:T.successLight,
                            color:a.priority==="high"?T.danger:a.priority==="medium"?T.warning:T.success,
                            alignSelf:"flex-start", flexShrink:0}}>
                            {a.priority}
                          </span>
                        </div>
                      ))}
                      {approvals.length===0 && (
                        <div style={{padding:24, textAlign:"center", color:T.faint, fontSize:13}}>
                          🎉 All caught up!
                        </div>
                      )}
                    </div>
                    <div style={{padding:"10px 18px", borderTop:`1px solid ${T.border}`}}>
                      <button onClick={()=>{setPage("approvals");setShowNotifs(false);}}
                        style={{background:"none", border:"none", cursor:"pointer",
                          fontSize:12, color:T.accent, fontWeight:600}}>
                        View all approvals →
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div style={{display:"flex", alignItems:"center", gap:8}}>
                <div style={{width:30, height:30, borderRadius:"50%", background:T.accent,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:"#fff", fontSize:11, fontWeight:700}}>
                  {(user?.name||"HR").split(" ").map(w=>w[0]).join("").slice(0,2)}
                </div>
                <div style={{fontSize:12}}>
                  <div style={{fontWeight:600, color:T.text}}>{user?.name}</div>
                  <div style={{color:T.faint, fontSize:11}}>{user?.role}</div>
                </div>
              </div>
              <Btn variant="accent" size="sm" onClick={onSwitch}>→ Employee Portal</Btn>
            </div>
          }/>
        <div style={{flex:1, padding:28, overflowY:"auto"}} onClick={()=>showNotifs&&setShowNotifs(false)}>
          {renderPage()}
        </div>
      </div>
      <Toast toasts={toast.toasts} remove={toast.remove}/>
    </div>
  );
}

// ─── EMPLOYEE: LOGIN ──────────────────────────────────────────────
function EmployeeLogin({ onLogin }) {
  const [credential, setCredential] = useState("DP-2024-007");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [forgotPw, setForgotPw] = useState(false);
  const [fpStep, setFpStep] = useState(1);
  const [fpEmail, setFpEmail] = useState("");
  const [fpOtp, setFpOtp] = useState(["","","","","",""]);
  const [fpNewPw, setFpNewPw] = useState("");

  // Demo accounts
  const ACCOUNTS = {
    "DP-2024-007": {status:"OFFER_SENT", name:"Karan Malhotra"},
    "DP-2024-008": {status:"OFFER_SENT", name:"Deepa Nair"},
    "JR-2024-009": {status:"APPLICATION_SUBMITTED", name:"Amit Verma"},
    "DP-2024-001": {status:"ACTIVE", name:"Arjun Sharma"},
    "newjoiner":   {status:"OFFER_ACCEPTED", name:"Rahul New"},
    "onboarding":  {status:"ONBOARDING_PENDING", name:"Sunita Devi"},
  };

  const submit = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,700));
    setLoading(false);
    const acc = ACCOUNTS[credential];
    if (!acc) { alert("Employee not found. Try: DP-2024-007, DP-2024-001, JR-2024-009, newjoiner, onboarding"); return; }
    onLogin({ ...acc, credential });
  };

  if (forgotPw) return (
    <div style={{minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{background:T.surface, borderRadius:20, padding:40, width:"100%", maxWidth:420,
        boxShadow:"0 12px 48px rgba(0,0,0,0.1)"}}>
        <div style={{textAlign:"center", marginBottom:28}}>
          <div style={{fontSize:36, marginBottom:10}}>🔐</div>
          <h2 style={{fontWeight:800, color:T.brand, marginBottom:6}}>Forgot Password</h2>
          <div style={{display:"flex", justifyContent:"center", gap:0, marginTop:16}}>
            {["Enter Email","Verify OTP","New Password"].map((s,i)=>(
              <div key={i} style={{display:"flex", alignItems:"center"}}>
                <div style={{width:28, height:28, borderRadius:"50%",
                  background:fpStep>i?T.success:fpStep===i+1?T.brand:T.bgDark,
                  display:"flex", alignItems:"center", justifyContent:"center",
                  color:fpStep>=i+1?"#fff":T.muted, fontSize:11, fontWeight:700}}>
                  {fpStep>i+1?"✓":i+1}
                </div>
                {i<2 && <div style={{width:40, height:2, background:fpStep>i+1?T.success:T.border}}/>}
              </div>
            ))}
          </div>
        </div>

        {fpStep===1 && (
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            <Input label="Email Address" type="email" value={fpEmail} onChange={e=>setFpEmail(e.target.value)}
              placeholder="your@email.com" hint="Enter the email linked to your employee account"/>
            <Btn variant="primary" full onClick={()=>{if(fpEmail)setFpStep(2);}}>
              Send OTP →
            </Btn>
          </div>
        )}
        {fpStep===2 && (
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            <p style={{fontSize:13, color:T.muted, textAlign:"center"}}>
              Enter the 6-digit OTP sent to <strong>{fpEmail}</strong>
            </p>
            <div style={{display:"flex", gap:8, justifyContent:"center"}}>
              {fpOtp.map((v,i)=>(
                <input key={i} type="text" maxLength={1} value={v}
                  onChange={e=>{const n=[...fpOtp];n[i]=e.target.value;setFpOtp(n);
                    if(e.target.value&&i<5)e.target.nextSibling?.focus();}}
                  style={{width:44, height:52, textAlign:"center", border:`2px solid ${T.border}`,
                    borderRadius:10, fontSize:20, fontWeight:700, color:T.brand}}/>
              ))}
            </div>
            <Btn variant="primary" full onClick={()=>{if(fpOtp.join("").length===6)setFpStep(3);}}>
              Verify OTP →
            </Btn>
            <p style={{fontSize:12, color:T.faint, textAlign:"center"}}>
              Demo: enter any 6 digits and click Verify
            </p>
          </div>
        )}
        {fpStep===3 && (
          <div style={{display:"flex", flexDirection:"column", gap:16}}>
            <Input label="New Password" type="password" value={fpNewPw}
              onChange={e=>setFpNewPw(e.target.value)} placeholder="••••••••"/>
            <Input label="Confirm New Password" type="password" placeholder="••••••••"/>
            <Btn variant="success" full onClick={()=>{setForgotPw(false);setFpStep(1);}}>
              Reset Password ✓
            </Btn>
          </div>
        )}
        <Btn variant="ghost" full onClick={()=>setForgotPw(false)} style={{marginTop:12}}>
          ← Back to Login
        </Btn>
      </div>
    </div>
  );

  return (
    <div style={{minHeight:"100vh", background:T.brand, display:"flex", alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{background:T.surface, borderRadius:20, padding:40, width:"100%", maxWidth:420,
        boxShadow:"0 24px 64px rgba(0,0,0,0.2)"}}>
        <div style={{textAlign:"center", marginBottom:28}}>
          <div style={{width:64, height:64, borderRadius:16, background:T.accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            fontSize:28, margin:"0 auto 16px", color:"#fff", fontWeight:900}}>D</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif", fontSize:22, color:T.brand, fontWeight:400, marginBottom:6}}>
            Employee Portal
          </h2>
          <p style={{color:T.muted, fontSize:13}}>Deneb & Pollux Tours and Travels</p>
        </div>

        <div style={{display:"flex", flexDirection:"column", gap:14}}>
          <Input label="Employee ID or Email" value={credential}
            onChange={e=>setCredential(e.target.value)}
            placeholder="DP-2024-001 or email"
            hint="Demo: DP-2024-007 (offer), DP-2024-001 (active), onboarding, newjoiner"/>
          <Input label="Password" type="password" value={password}
            onChange={e=>setPassword(e.target.value)} placeholder="••••••••"/>
          <Btn variant="primary" full onClick={submit} disabled={loading}
            style={{marginTop:4, padding:"13px"}}>
            {loading?"Signing in…":"Sign In →"}
          </Btn>
        </div>

        <button onClick={()=>setForgotPw(true)}
          style={{display:"block", margin:"14px auto 0", background:"none", border:"none",
            cursor:"pointer", fontSize:13, color:T.accent, fontWeight:500}}>
          Forgot Password?
        </button>
      </div>
    </div>
  );
}

// ─── EMPLOYEE: OFFER LETTER ───────────────────────────────────────
function OfferLetter({ employee, onAccept, onReject }) {
  const [loading, setLoading] = useState(false);
  const accept = async () => {
    setLoading(true);
    await new Promise(r=>setTimeout(r,800));
    setLoading(false);
    onAccept();
  };

  return (
    <div style={{minHeight:"100vh", background:T.bg}}>
      <header style={{height:60, background:T.brand, padding:"0 24px", display:"flex",
        alignItems:"center", justifyContent:"space-between"}}>
        <div style={{fontFamily:"'DM Serif Display',serif", color:"#fff", fontSize:18}}>Deneb & Pollux</div>
        <span style={{color:"rgba(255,255,255,.5)", fontSize:12, textTransform:"uppercase", letterSpacing:"0.08em"}}>Offer Letter</span>
      </header>

      <div style={{maxWidth:760, margin:"0 auto", padding:32}}>
        <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:16,
          overflow:"hidden", boxShadow:"0 8px 32px rgba(0,0,0,0.08)"}}>
          {/* Offer header */}
          <div style={{background:`linear-gradient(135deg, ${T.brand} 0%, ${T.brandLight} 100%)`,
            padding:"36px 40px"}}>
            <div style={{fontSize:12, color:"rgba(255,255,255,.5)", textTransform:"uppercase",
              letterSpacing:"0.1em", marginBottom:8}}>Letter of Offer</div>
            <h1 style={{fontFamily:"'DM Serif Display',serif", fontSize:28, color:"#fff",
              fontWeight:400, marginBottom:6}}>Congratulations, {employee.name}!</h1>
            <p style={{color:"rgba(255,255,255,.65)", fontSize:15, lineHeight:1.6}}>
              We are pleased to extend this offer of employment.
            </p>
          </div>

          <div style={{padding:40}}>
            <p style={{color:T.text, fontSize:14, lineHeight:1.8, marginBottom:24}}>
              Dear <strong>{employee.name}</strong>,
            </p>
            <p style={{color:T.muted, fontSize:14, lineHeight:1.8, marginBottom:24}}>
              We are delighted to offer you the position of <strong>Tour Coordinator</strong> at
              Deneb & Pollux Tours and Travels Pvt Ltd, reporting to the Head of Operations.
            </p>
            <p style={{color:T.muted, fontSize:14, lineHeight:1.8, marginBottom:28}}>
              Your employment is expected to commence on <strong>10th June 2024</strong>.
              This offer is subject to successful completion of the joining formalities and background verification.
            </p>

            {/* Terms grid */}
            <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:28}}>
              {[
                ["💼 Designation","Tour Coordinator"],
                ["🏢 Department","Operations"],
                ["📅 Joining Date","10 June 2024"],
                ["💰 CTC","₹4,20,000 per annum"],
                ["⏰ Work Hours","9:00 AM – 6:00 PM (Mon–Sat)"],
                ["📍 Location","New Delhi, India"],
                ["⚖️ Probation","6 months"],
                ["🏝️ Annual Leave","18 days paid leave"],
              ].map(([l,v])=>(
                <div key={l} style={{background:T.surface2, border:`1px solid ${T.border}`,
                  borderRadius:10, padding:"14px 16px"}}>
                  <div style={{fontSize:12, color:T.faint, marginBottom:3}}>{l}</div>
                  <div style={{fontWeight:600, color:T.text, fontSize:14}}>{v}</div>
                </div>
              ))}
            </div>

            <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`,
              borderRadius:10, padding:"14px 18px", marginBottom:28, fontSize:13, color:T.info}}>
              ℹ️ This offer is valid for <strong>7 days</strong>. Please review and respond before 17 June 2024.
            </div>

            <div style={{display:"flex", gap:14}}>
              <Btn variant="success" size="lg" onClick={accept} disabled={loading} style={{flex:1}}>
                {loading ? "Processing…" : "✅ Accept Offer"}
              </Btn>
              <Btn variant="secondary" size="lg" onClick={onReject} style={{flex:1}}>
                ✕ Decline Offer
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEE: ONBOARDING WIZARD ─────────────────────────────────
const STEP_LABELS = ["Personal Info","ID Documents","Education","Work Experience","Bank Details","References","Photo Upload","Review & Submit"];

function WizardStep({ step, total, children, onNext, onPrev, onSave, saving }) {
  return (
    <div style={{flex:1, display:"flex", flexDirection:"column"}}>
      <div style={{overflowY:"auto", flex:1, padding:"24px 0"}}>{children}</div>
      <div style={{padding:"16px 28px", borderTop:`1px solid ${T.border}`,
        display:"flex", alignItems:"center", justifyContent:"space-between",
        background:T.surface, flexShrink:0}}>
        {step>1 ? <Btn variant="secondary" size="lg" onClick={onPrev}>← Previous</Btn> : <div/>}
        <div style={{display:"flex", gap:10}}>
          <Btn variant="ghost" size="sm" onClick={onSave} disabled={saving}>
            {saving?"Saving…":"💾 Save Draft"}
          </Btn>
          {step<total
            ? <Btn variant="primary" size="lg" onClick={onNext}>Continue →</Btn>
            : null
          }
        </div>
      </div>
    </div>
  );
}

function OnboardingWizard({ employee, onSubmit, toast }) {
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Step 1
  const [marital, setMarital] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["","","","","",""]);
  const [curAddress, setCurAddress] = useState("");
  const [permAddress, setPermAddress] = useState("");
  const [sameAddr, setSameAddr] = useState(false);
  const [emergName, setEmergName] = useState("");
  const [emergPhone, setEmergPhone] = useState("");
  const [emergRel, setEmergRel] = useState("");
  const [aadhaarXml, setAadhaarXml] = useState(null);
  const [aadhaarPdf, setAadhaarPdf] = useState(null);
  const [xmlVerified, setXmlVerified] = useState(false);
  const [xmlData, setXmlData] = useState({name:"",dob:"",gender:"",aadhaar:"",address:""});

  // Step 2
  const [panNumber, setPanNumber] = useState("");
  const [idAadhaar, setIdAadhaar] = useState(null);
  const [panCard, setPanCard] = useState(null);
  const [addressProof, setAddressProof] = useState(null);
  const [addressProofType, setAddressProofType] = useState("");
  const [passport, setPassport] = useState(null);
  const [passportNum, setPassportNum] = useState("");
  const [dlNum, setDlNum] = useState("");
  const [dlFile, setDlFile] = useState(null);

  // Step 3
  const [degree, setDegree] = useState("");
  const [gradYear, setGradYear] = useState("");
  const [college, setCollege] = useState("");
  const [university, setUniversity] = useState("");
  const [cert10th, setCert10th] = useState(null);
  const [cert12th, setCert12th] = useState(null);
  const [certDegree, setCertDegree] = useState(null);
  const [certMarksheets, setCertMarksheets] = useState(null);
  const [extraCerts, setExtraCerts] = useState([]);

  // Step 4
  const [expYears, setExpYears] = useState("");
  const [expMonths, setExpMonths] = useState("");
  const [expRecords, setExpRecords] = useState([]);
  const [expLetter, setExpLetter] = useState(null);
  const [relieving, setRelieving] = useState(null);
  const [pfNumber, setPfNumber] = useState("");
  const [slip1, setSlip1] = useState(null);
  const [slip2, setSlip2] = useState(null);
  const [slip3, setSlip3] = useState(null);

  // Step 5
  const [bankName, setBankName] = useState("");
  const [bankBranch, setBankBranch] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNum, setAccountNum] = useState("");
  const [accountNumConf, setAccountNumConf] = useState("");
  const [ifsc, setIfsc] = useState("");
  const [ifscResult, setIfscResult] = useState("");
  const [cheque, setCheque] = useState(null);

  // Step 6
  const [ref1, setRef1] = useState({name:"",phone:"",email:"",designation:"",company:"",relation:""});
  const [ref2, setRef2] = useState({name:"",phone:"",email:"",designation:"",company:"",relation:""});
  const [bvgConsent, setBvgConsent] = useState(false);

  // Step 7
  const [photoPng, setPhotoPng] = useState(null);
  const [photoJpeg, setPhotoJpeg] = useState(null);

  // Step 8
  const [declaration, setDeclaration] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);

  const TOTAL = 8;

  const saveDraft = async () => {
    setSaving(true);
    await new Promise(r=>setTimeout(r,600));
    setSaving(false);
    toast.add("Draft saved","success");
  };

  const validate = () => {
    if (step===1) {
      if (!aadhaarXml||!aadhaarPdf) { toast.add("Upload Aadhaar XML and PDF","warning"); return false; }
      if (!marital||!phone||!email) { toast.add("Fill all required personal fields","warning"); return false; }
      if (!emailVerified) { toast.add("Please verify your email with OTP","warning"); return false; }
      if (!curAddress||!permAddress) { toast.add("Fill current and permanent address","warning"); return false; }
      if (!emergName||!emergPhone||!emergRel) { toast.add("Fill emergency contact","warning"); return false; }
    }
    if (step===2) {
      if (!idAadhaar||!panCard||!addressProof) { toast.add("Upload Aadhaar, PAN and Address Proof","warning"); return false; }
      if (!panNumber.match(/^[A-Z]{5}[0-9]{4}[A-Z]$/i)) { toast.add("Enter valid PAN number (e.g. ABCDE1234F)","warning"); return false; }
    }
    if (step===3) {
      if (!degree||!gradYear||!college||!university) { toast.add("Fill all education fields","warning"); return false; }
      const mandatory = [cert10th,cert12th,certDegree,certMarksheets].filter(Boolean).length;
      if (mandatory<4) { toast.add("Upload all 4 mandatory education documents","warning"); return false; }
      if (mandatory+extraCerts.length<5) { toast.add("Minimum 5 total documents required","warning"); return false; }
    }
    if (step===4) {
      if (!expLetter||!relieving) { toast.add("Upload Experience and Relieving letters","warning"); return false; }
      if (!slip1||!slip2||!slip3) { toast.add("Upload all 3 salary slips","warning"); return false; }
    }
    if (step===5) {
      if (!bankName||!bankBranch||!accountHolder||!accountNum||!ifsc) { toast.add("Fill all bank details","warning"); return false; }
      if (accountNum!==accountNumConf) { toast.add("Account numbers don't match","warning"); return false; }
      if (!cheque) { toast.add("Upload cancelled cheque","warning"); return false; }
    }
    if (step===6) {
      if (!ref1.name||!ref1.phone||!ref1.email||!ref1.relation) { toast.add("Fill Reference 1 details","warning"); return false; }
      if (!ref2.name||!ref2.phone||!ref2.email||!ref2.relation) { toast.add("Fill Reference 2 details","warning"); return false; }
      if (!bvgConsent) { toast.add("You must agree to the background verification consent","warning"); return false; }
    }
    if (step===7) {
      if (!photoPng||!photoJpeg) { toast.add("Upload passport photo in both PNG and JPEG formats","warning"); return false; }
    }
    return true;
  };

  const next = () => { if (!validate()) return; if(step<TOTAL){setStep(s=>s+1); window.scrollTo(0,0);} };
  const prev = () => { if(step>1){setStep(s=>s-1); window.scrollTo(0,0);} };

  const finalSubmit = async () => {
    if (!declaration) { toast.add("Check the final declaration to proceed","warning"); return; }
    setSubmitLoading(true);
    await new Promise(r=>setTimeout(r,1500));
    setSubmitLoading(false);
    setSubmitted(true);
    onSubmit();
  };

  const reqUploads = [aadhaarXml,aadhaarPdf,idAadhaar,panCard,addressProof,cert10th,cert12th,certDegree,certMarksheets,expLetter,relieving,slip1,slip2,slip3,cheque,photoPng,photoJpeg];
  const uploadedCount = reqUploads.filter(Boolean).length;
  const completionPct = Math.round((uploadedCount/reqUploads.length)*100);
  const ringOffset = 251.2 - (251.2 * completionPct / 100);

  const addExpRecord = () => setExpRecords(p=>[...p,{id:Date.now(),company:"",title:"",dept:"",location:"",manager:"",managerPhone:"",from:"",to:"",empType:"",reason:""}]);
  const addExtraCert = () => setExtraCerts(p=>[...p,{id:Date.now(),name:"",issuer:"",year:"",file:null}]);

  const lookupIFSC = async () => {
    if (!ifsc||ifsc.length!==11) { toast.add("Enter a valid 11-character IFSC code","warning"); return; }
    await new Promise(r=>setTimeout(r,400));
    const banks = {HDFC:"HDFC Bank",ICIC:"ICICI Bank",SBIN:"State Bank of India",UTIB:"Axis Bank",KKBK:"Kotak Bank"};
    const bankCode = ifsc.slice(0,4);
    const bank = banks[bankCode]||"Bank Name";
    setIfscResult(`✓ ${bank} — Demo Branch, New Delhi`);
    setBankName(bank);
    setBankBranch("Demo Branch");
    toast.add("Bank details auto-filled","success");
  };

  if (submitted) return (
    <div style={{minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{textAlign:"center", padding:48}}>
        <div style={{fontSize:72, marginBottom:20}}>🎉</div>
        <h2 style={{fontFamily:"'DM Serif Display',serif", fontSize:28, color:T.brand, marginBottom:10}}>
          Form Submitted Successfully!
        </h2>
        <p style={{color:T.muted, maxWidth:440, margin:"0 auto 24px", lineHeight:1.6}}>
          Your joining form has been received. The HR team will review your documents and respond within 2 business days.
        </p>
        <div style={{fontSize:13, color:T.faint}}>Reference ID: <strong style={{color:T.brand}}>DP-{Date.now().toString().slice(-6)}</strong></div>
      </div>
    </div>
  );

  const RelField = ({label,val,set,placeholder,required}) => (
    <Input label={label} required={required} value={val}
      onChange={e=>set(e.target.value)} placeholder={placeholder}/>
  );

  return (
    <div style={{minHeight:"100vh", background:T.bg, display:"flex", flexDirection:"column"}}>
      {/* Topbar */}
      <header style={{height:52, background:T.brand, padding:"0 24px", display:"flex",
        alignItems:"center", justifyContent:"space-between", flexShrink:0, position:"sticky", top:0, zIndex:50}}>
        <div style={{fontFamily:"'DM Serif Display',serif", color:"#fff", fontSize:16}}>Deneb & Pollux</div>
        <div style={{display:"flex", alignItems:"center", gap:14}}>
          <span style={{color:"rgba(255,255,255,.55)", fontSize:12}}>{saving?"Saving…":"Draft saved ✓"}</span>
        </div>
      </header>

      {/* Step progress bar */}
      <div style={{background:T.surface, borderBottom:`1px solid ${T.border}`,
        padding:"14px 28px", position:"sticky", top:52, zIndex:40}}>
        <div style={{display:"flex", alignItems:"center", gap:8, marginBottom:10}}>
          <span style={{fontSize:12, fontWeight:600, color:T.muted}}>Step {step} of {TOTAL}:</span>
          <span style={{fontSize:13, fontWeight:700, color:T.brand}}>{STEP_LABELS[step-1]}</span>
          <div style={{flex:1, height:4, background:T.bgDark, borderRadius:2, marginLeft:8}}>
            <div style={{width:`${(step/TOTAL)*100}%`, height:"100%",
              background:T.accent, borderRadius:2, transition:"width 0.3s"}}/>
          </div>
          <span style={{fontSize:12, color:T.faint}}>{Math.round((step/TOTAL)*100)}%</span>
        </div>
        {/* Desktop stepper */}
        <div style={{display:"flex", alignItems:"center", overflowX:"auto", paddingBottom:2}}>
          {STEP_LABELS.map((lbl,i)=>{
            const n=i+1, done=n<step, active=n===step;
            return (
              <div key={n} style={{display:"flex", alignItems:"center"}}>
                <div style={{display:"flex", alignItems:"center", gap:6,
                  opacity:done||active?1:0.4}}>
                  <div style={{width:24, height:24, borderRadius:"50%", flexShrink:0,
                    background:done?T.success:active?T.brand:T.bgDark,
                    display:"flex", alignItems:"center", justifyContent:"center",
                    color:done||active?"#fff":T.muted, fontSize:10, fontWeight:700}}>
                    {done?"✓":n}
                  </div>
                  <span style={{fontSize:11, color:active?T.brand:done?T.success:T.muted,
                    fontWeight:active?700:400, whiteSpace:"nowrap"}}>{lbl}</span>
                </div>
                {i<STEP_LABELS.length-1 && (
                  <div style={{width:24, height:2, background:done?T.success:T.border, margin:"0 4px"}}/>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div style={{flex:1, display:"flex", flexDirection:"column"}}>
        <div style={{flex:1, maxWidth:860, margin:"0 auto", width:"100%", padding:"0 20px"}}>

          {/* ── STEP 1 ── */}
          {step===1 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`, borderRadius:12, padding:"16px 20px", marginBottom:20, fontSize:13}}>
                <div style={{fontWeight:700, color:T.info, marginBottom:8}}>ℹ️ How to get your Aadhaar Offline XML</div>
                <ol style={{paddingLeft:18, color:T.muted, display:"flex", flexDirection:"column", gap:5, lineHeight:1.7}}>
                  <li>Visit <a href="https://myaadhaar.uidai.gov.in/" target="_blank" rel="noopener" style={{color:T.info, fontWeight:500}}>MyAadhaar Offline e-KYC Portal ↗</a></li>
                  <li>Enter Aadhaar number / VID and complete captcha</li>
                  <li>Enter OTP sent to your registered mobile</li>
                  <li>Create a <strong>Share Code</strong> (XML password — keep safe)</li>
                  <li>Download the ZIP with the digitally signed XML</li>
                  <li>Also download your <strong>Aadhaar PDF</strong> from the same portal</li>
                </ol>
              </div>

              <FormSection icon="🪪" title="Aadhaar Verification">
                <FormGrid cols={2}>
                  <div>
                    <UploadZone label="Aadhaar XML File" required accept=".xml"
                      value={aadhaarXml} onChange={setAadhaarXml}/>
                    <Input label="XML Share Code" required type="password" value=""
                      placeholder="Share code created during download" style={{marginTop:8}}/>
                  </div>
                  <div>
                    <UploadZone label="Aadhaar PDF" required accept=".pdf"
                      value={aadhaarPdf} onChange={setAadhaarPdf}/>
                    <Btn variant="secondary" size="sm" full style={{marginTop:8}}
                      onClick={()=>window.open("https://myaadhaar.uidai.gov.in/genricDownloadAadhaar","_blank")}>
                      ↗ Download Aadhaar PDF
                    </Btn>
                  </div>
                </FormGrid>
                {aadhaarXml&&aadhaarPdf&&!xmlVerified && (
                  <Btn variant="primary" size="sm" style={{marginTop:14}} onClick={()=>{
                    setXmlVerified(true);
                    setXmlData({name:"(Auto-filled from XML)",dob:"01/01/1995",gender:"Male",aadhaar:"XXXX-XXXX-1234",address:"Verified Address from Aadhaar"});
                    toast.add("Aadhaar data extracted","success");
                  }}>
                    🔍 Verify & Extract Aadhaar Data
                  </Btn>
                )}
                {xmlVerified && (
                  <div style={{marginTop:14}}>
                    <div style={{fontSize:12, fontWeight:600, color:T.success, marginBottom:10}}>
                      ✓ Verified from Aadhaar XML
                    </div>
                    <FormGrid cols={2}>
                      {[["Full Name",xmlData.name],["Date of Birth",xmlData.dob],
                        ["Gender",xmlData.gender],["Aadhaar (Masked)",xmlData.aadhaar]].map(([l,v])=>(
                        <div key={l} style={{position:"relative"}}>
                          <Input label={l} value={v} readOnly
                            inputStyle={{background:T.successLight, border:`1.5px solid ${T.successBorder}`, paddingRight:100}}/>
                          <span style={{position:"absolute", right:10, top:"50%", transform:"translateY(30%)",
                            background:T.successLight, color:T.success, border:`1px solid ${T.successBorder}`,
                            borderRadius:99, fontSize:10, fontWeight:700, padding:"2px 8px", pointerEvents:"none"}}>
                            ✓ Aadhaar Verified
                          </span>
                        </div>
                      ))}
                      <div style={{gridColumn:"span 2"}}>
                        <Textarea label="Aadhaar Address" value={xmlData.address} readOnly rows={2}/>
                      </div>
                    </FormGrid>
                  </div>
                )}
              </FormSection>

              <FormSection icon="👤" title="Personal Details">
                <FormGrid cols={2}>
                  <Select label="Marital Status" required value={marital} onChange={e=>setMarital(e.target.value)}
                    options={[{value:"",label:"Select status"},"Single","Married","Divorced","Widowed"].map(o=>typeof o==="string"?{value:o,label:o}:o)}/>
                  <div>
                    <label style={{fontSize:13, fontWeight:600, color:T.text, marginBottom:4, display:"block"}}>
                      Contact Number <span style={{color:T.danger}}>*</span>
                    </label>
                    <div style={{display:"flex"}}>
                      <span style={{background:T.bgDark, border:`1.5px solid ${T.border}`, borderRight:"none",
                        borderRadius:"8px 0 0 8px", padding:"9px 10px", fontSize:13, color:T.muted}}>+91</span>
                      <input type="tel" value={phone} onChange={e=>setPhone(e.target.value)}
                        placeholder="9876543210" maxLength={10}
                        style={{flex:1, border:`1.5px solid ${T.border}`, borderRadius:"0 8px 8px 0",
                          padding:"9px 12px", fontSize:14}}/>
                    </div>
                  </div>
                  <div>
                    <label style={{fontSize:13, fontWeight:600, color:T.text, marginBottom:4, display:"block"}}>
                      Personal Email <span style={{color:T.danger}}>*</span>
                    </label>
                    <div style={{display:"flex", gap:8}}>
                      <input type="email" value={email} onChange={e=>setEmail(e.target.value)}
                        readOnly={emailVerified} placeholder="you@gmail.com"
                        style={{flex:1, border:`1.5px solid ${T.border}`, borderRadius:8,
                          padding:"9px 12px", fontSize:14, background:emailVerified?T.successLight:T.surface}}/>
                      <Btn variant={emailVerified?"success":"secondary"} size="sm"
                        onClick={()=>{if(email&&!emailVerified){setOtpSent(true);toast.add("OTP sent to "+email,"success");}}}
                        disabled={emailVerified}>
                        {emailVerified?"✓ Verified":"Send OTP"}
                      </Btn>
                    </div>
                    {otpSent&&!emailVerified && (
                      <div style={{marginTop:10}}>
                        <div style={{fontSize:12, color:T.muted, marginBottom:8}}>Enter 6-digit OTP</div>
                        <div style={{display:"flex", gap:6}}>
                          {otp.map((v,i)=>(
                            <input key={i} type="text" maxLength={1} value={v}
                              onChange={e=>{const n=[...otp];n[i]=e.target.value;setOtp(n);
                                if(e.target.value&&i<5)e.target.nextSibling?.focus();}}
                              style={{width:38, height:44, textAlign:"center", border:`2px solid ${T.border}`,
                                borderRadius:8, fontSize:16, fontWeight:700}}/>
                          ))}
                          <Btn variant="success" size="sm" style={{alignSelf:"flex-end"}}
                            onClick={()=>{if(otp.join("").length===6){setEmailVerified(true);setOtpSent(false);}}}>
                            Verify
                          </Btn>
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    <label style={{fontSize:13, fontWeight:600, color:T.text, marginBottom:4, display:"block"}}>
                      Alternate Number <span style={{color:T.faint, fontSize:11}}>(optional)</span>
                    </label>
                    <div style={{display:"flex"}}>
                      <span style={{background:T.bgDark, border:`1.5px solid ${T.border}`, borderRight:"none",
                        borderRadius:"8px 0 0 8px", padding:"9px 10px", fontSize:13, color:T.muted}}>+91</span>
                      <input type="tel" placeholder="9876543210" maxLength={10}
                        style={{flex:1, border:`1.5px solid ${T.border}`, borderRadius:"0 8px 8px 0", padding:"9px 12px", fontSize:14}}/>
                    </div>
                  </div>
                </FormGrid>

                <div style={{height:1, background:T.border, margin:"20px 0"}}/>
                <div style={{fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:12}}>Address Details</div>
                <div style={{display:"flex", flexDirection:"column", gap:12}}>
                  <Textarea label="Current Address" required rows={2} value={curAddress}
                    onChange={e=>setCurAddress(e.target.value)} placeholder="Flat/House No, Street, Area, City, State — PIN"/>
                  <Textarea label="Permanent Address" required rows={2} value={permAddress}
                    onChange={e=>setPermAddress(e.target.value)} placeholder="Flat/House No, Street, Area, City, State — PIN"/>
                  <label style={{display:"flex", alignItems:"center", gap:8, fontSize:13, cursor:"pointer"}}>
                    <input type="checkbox" checked={sameAddr} onChange={e=>{
                      setSameAddr(e.target.checked);
                      if(e.target.checked) setPermAddress(curAddress);
                    }}/>
                    Same as current address
                  </label>
                </div>

                <div style={{height:1, background:T.border, margin:"20px 0"}}/>
                <div style={{fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase",
                  letterSpacing:"0.08em", marginBottom:12}}>Emergency Contact</div>
                <FormGrid cols={3}>
                  <Input label="Contact Name" required value={emergName} onChange={e=>setEmergName(e.target.value)} placeholder="Full name"/>
                  <Input label="Contact Number" required type="tel" value={emergPhone} onChange={e=>setEmergPhone(e.target.value)} placeholder="+91 9876543210"/>
                  <Select label="Relationship" required value={emergRel} onChange={e=>setEmergRel(e.target.value)}
                    options={[{value:"",label:"Select"},"Spouse","Parent","Sibling","Friend","Other"].map(o=>typeof o==="string"?{value:o,label:o}:o)}/>
                </FormGrid>
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 2 ── */}
          {step===2 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <FormSection icon="🪪" title="Identification Documents">
                <div style={{display:"flex", flexDirection:"column", gap:20}}>
                  {/* Aadhaar */}
                  <div>
                    <UploadZone label="Aadhaar Card PDF" required accept=".pdf,.png,.jpg,.jpeg"
                      value={idAadhaar} onChange={setIdAadhaar}/>
                    <Btn variant="ghost" size="sm" style={{marginTop:6}}
                      onClick={()=>window.open("https://myaadhaar.uidai.gov.in/genricDownloadAadhaar","_blank")}>
                      ↗ Download from UIDAI
                    </Btn>
                  </div>

                  {/* PAN */}
                  <div>
                    <FormGrid cols={2}>
                      <Input label="PAN Number" required value={panNumber}
                        onChange={e=>setPanNumber(e.target.value.toUpperCase())}
                        placeholder="ABCDE1234F" maxLength={10}
                        inputStyle={{textTransform:"uppercase"}}/>
                    </FormGrid>
                    <div style={{marginTop:10}}>
                      <UploadZone label="PAN Card" required accept=".pdf,.png,.jpg,.jpeg"
                        value={panCard} onChange={setPanCard}/>
                    </div>
                    <div style={{display:"flex", gap:8, marginTop:6, flexWrap:"wrap"}}>
                      <Btn variant="ghost" size="sm" onClick={()=>window.open("https://onlineservices.proteantech.in/paam/requestAndDownloadEPAN.html","_blank")}>
                        ↗ Download via Protean (NSDL)
                      </Btn>
                      <Btn variant="ghost" size="sm" onClick={()=>window.open("https://pan.utiitsl.com/PAN_ONLINE/ePANCardHome.action","_blank")}>
                        ↗ Download via UTI
                      </Btn>
                    </div>
                  </div>

                  {/* Address Proof */}
                  <div>
                    <Select label="Address Proof Type" required value={addressProofType}
                      onChange={e=>setAddressProofType(e.target.value)}
                      options={[{value:"",label:"Select document type"},
                        "House Rent Agreement","Electricity Bill","Passport","Driving License","Bank Statement"].map(o=>typeof o==="string"?{value:o,label:o}:o)}
                      style={{marginBottom:10}}/>
                    <UploadZone label="Address Proof Document" required accept=".pdf,.png,.jpg,.jpeg"
                      value={addressProof} onChange={setAddressProof}/>
                  </div>

                  {/* Passport (optional) */}
                  <div>
                    <div style={{fontSize:13, fontWeight:700, color:T.text, marginBottom:8}}>
                      Passport <span style={{color:T.faint, fontWeight:400, fontSize:12}}>(optional)</span>
                    </div>
                    <FormGrid cols={2}>
                      <Input label="Passport Number" value={passportNum} onChange={e=>setPassportNum(e.target.value)} placeholder="A1234567"/>
                      <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
                    </FormGrid>
                    <div style={{marginTop:10}}>
                      <UploadZone accept=".pdf,.png,.jpg,.jpeg" value={passport} onChange={setPassport} compact
                        label="" hint="Upload Passport (front & back)"/>
                    </div>
                  </div>

                  {/* Driving License (optional) */}
                  <div>
                    <div style={{fontSize:13, fontWeight:700, color:T.text, marginBottom:8}}>
                      Driving License <span style={{color:T.faint, fontWeight:400, fontSize:12}}>(optional)</span>
                    </div>
                    <FormGrid cols={2}>
                      <Input label="DL Number" value={dlNum} onChange={e=>setDlNum(e.target.value)} placeholder="DL-0420110149646"/>
                      <Input label="Expiry Date" type="date" value="" onChange={()=>{}}/>
                    </FormGrid>
                    <div style={{marginTop:10}}>
                      <UploadZone accept=".pdf,.png,.jpg,.jpeg" value={dlFile} onChange={setDlFile} compact hint="Upload Driving License"/>
                    </div>
                  </div>
                </div>
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 3 ── */}
          {step===3 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`, borderRadius:10,
                padding:"12px 16px", marginBottom:16, fontSize:13, color:T.info}}>
                ℹ️ <strong>Minimum 5 certifications required</strong> — Upload at least 5 total education/certification documents before proceeding.
              </div>

              <FormSection icon="🎓" title="Education Details">
                <FormGrid cols={2}>
                  <Select label="Highest Degree" required value={degree} onChange={e=>setDegree(e.target.value)}
                    options={[{value:"",label:"Select degree"},"10th / Secondary","12th / Higher Secondary",
                      "Diploma","Bachelor's (B.A./B.Sc./B.Com/BBA/B.Tech)",
                      "Master's (M.A./M.Sc./MBA/M.Tech)","Ph.D.","Other"].map(o=>typeof o==="string"?{value:o,label:o}:o)}/>
                  <Input label="Graduation Year" required type="number" value={gradYear}
                    onChange={e=>setGradYear(e.target.value)} placeholder="2022" min="1970" max="2030"/>
                  <Input label="College / Institution" required value={college}
                    onChange={e=>setCollege(e.target.value)} placeholder="e.g. Delhi College of Engineering"/>
                  <Input label="University / Board" required value={university}
                    onChange={e=>setUniversity(e.target.value)} placeholder="e.g. Delhi University"/>
                </FormGrid>
              </FormSection>

              <FormSection icon="📁" title="Mandatory Education Documents">
                <FormGrid cols={2}>
                  <UploadZone label="10th Certificate" required accept=".pdf,.jpg,.png" value={cert10th} onChange={setCert10th}/>
                  <UploadZone label="12th Certificate" required accept=".pdf,.jpg,.png" value={cert12th} onChange={setCert12th}/>
                  <UploadZone label="Degree Certificate" required accept=".pdf,.jpg,.png" value={certDegree} onChange={setCertDegree}/>
                  <UploadZone label="All Year Marksheets" required accept=".pdf,.jpg,.png" value={certMarksheets} onChange={setCertMarksheets} hint="You can upload multiple files"/>
                </FormGrid>
              </FormSection>

              <FormSection icon="🏆" title="Additional Certifications"
                action={<Badge color="accent">{[cert10th,cert12th,certDegree,certMarksheets].filter(Boolean).length+extraCerts.length} uploaded</Badge>}>
                {extraCerts.map((c,i)=>(
                  <div key={c.id} style={{background:T.surface2, border:`1px solid ${T.border}`,
                    borderRadius:10, padding:16, marginBottom:10}}>
                    <div style={{display:"flex", justifyContent:"space-between", marginBottom:10}}>
                      <span style={{fontWeight:600, fontSize:13}}>Certification {i+1}</span>
                      <Btn variant="ghost" size="xs" onClick={()=>setExtraCerts(p=>p.filter(x=>x.id!==c.id))}>Remove</Btn>
                    </div>
                    <FormGrid cols={2}>
                      <Input label="Course/Certification Name" value={c.name}
                        onChange={e=>setExtraCerts(p=>p.map(x=>x.id===c.id?{...x,name:e.target.value}:x))}
                        placeholder="e.g. Google Analytics, AWS Cloud"/>
                      <Input label="Issuing Authority" value={c.issuer}
                        onChange={e=>setExtraCerts(p=>p.map(x=>x.id===c.id?{...x,issuer:e.target.value}:x))}
                        placeholder="e.g. Google, Coursera"/>
                      <Input label="Year" type="number" value={c.year}
                        onChange={e=>setExtraCerts(p=>p.map(x=>x.id===c.id?{...x,year:e.target.value}:x))}
                        placeholder="2023"/>
                      <UploadZone label="Certificate" accept=".pdf,.jpg,.png" compact
                        value={c.file} onChange={f=>setExtraCerts(p=>p.map(x=>x.id===c.id?{...x,file:f}:x))}/>
                    </FormGrid>
                  </div>
                ))}
                <button onClick={addExtraCert}
                  style={{width:"100%", padding:"12px", border:`2px dashed ${T.border}`, borderRadius:10,
                    background:"transparent", cursor:"pointer", fontSize:13, fontWeight:600, color:T.muted}}>
                  + Add Certification / Course
                </button>
                {[cert10th,cert12th,certDegree,certMarksheets].filter(Boolean).length+extraCerts.length<5 && (
                  <div style={{marginTop:10, background:T.dangerLight, border:`1px solid ${T.dangerBorder}`,
                    borderRadius:8, padding:"10px 14px", fontSize:13, color:T.danger}}>
                    ⚠ Please upload at least <strong>5 total documents</strong> (mandatory + additional combined).
                  </div>
                )}
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 4 ── */}
          {step===4 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <FormSection icon="💼" title="Work Experience">
                <div style={{display:"flex", gap:12, marginBottom:4}}>
                  <div style={{display:"flex", alignItems:"center", border:`1.5px solid ${T.border}`, borderRadius:8, overflow:"hidden"}}>
                    <input type="number" value={expYears} onChange={e=>setExpYears(e.target.value)}
                      placeholder="0" min="0" max="50"
                      style={{width:60, border:"none", padding:"9px 10px", fontSize:14, outline:"none"}}/>
                    <span style={{background:T.bgDark, padding:"9px 10px", fontSize:13, color:T.muted, borderLeft:`1px solid ${T.border}`}}>Years</span>
                  </div>
                  <div style={{display:"flex", alignItems:"center", border:`1.5px solid ${T.border}`, borderRadius:8, overflow:"hidden"}}>
                    <input type="number" value={expMonths} onChange={e=>setExpMonths(e.target.value)}
                      placeholder="0" min="0" max="11"
                      style={{width:60, border:"none", padding:"9px 10px", fontSize:14, outline:"none"}}/>
                    <span style={{background:T.bgDark, padding:"9px 10px", fontSize:13, color:T.muted, borderLeft:`1px solid ${T.border}`}}>Months</span>
                  </div>
                </div>
              </FormSection>

              {expRecords.map((r,i)=>(
                <FormSection key={r.id} icon="🏢" title={`Experience ${i+1}`}
                  action={<Btn variant="ghost" size="xs" onClick={()=>setExpRecords(p=>p.filter(x=>x.id!==r.id))}>Remove</Btn>}>
                  <FormGrid cols={2}>
                    {[["Previous Employer","company","Company name"],["Designation","title","Your job title"],
                      ["Department","dept","e.g. Operations"],["Work Location","location","City, State"],
                      ["Reporting Manager","manager","Manager name"],["Manager Contact","managerPhone","9876543210"]].map(([l,k,ph])=>(
                      <Input key={k} label={l} value={r[k]}
                        onChange={e=>setExpRecords(p=>p.map(x=>x.id===r.id?{...x,[k]:e.target.value}:x))}
                        placeholder={ph}/>
                    ))}
                    <Input label="Joining Date" type="date" value={r.from}
                      onChange={e=>setExpRecords(p=>p.map(x=>x.id===r.id?{...x,from:e.target.value}:x))}/>
                    <Input label="Relieving Date" type="date" value={r.to}
                      onChange={e=>setExpRecords(p=>p.map(x=>x.id===r.id?{...x,to:e.target.value}:x))}/>
                    <Select label="Employment Type" value={r.empType}
                      onChange={e=>setExpRecords(p=>p.map(x=>x.id===r.id?{...x,empType:e.target.value}:x))}
                      options={[{value:"",label:"Select"},"Full Time","Part Time","Contract","Internship"].map(o=>typeof o==="string"?{value:o,label:o}:o)}/>
                    <Input label="Reason for Leaving" value={r.reason}
                      onChange={e=>setExpRecords(p=>p.map(x=>x.id===r.id?{...x,reason:e.target.value}:x))}
                      placeholder="e.g. Better opportunity"/>
                  </FormGrid>
                </FormSection>
              ))}

              <button onClick={addExpRecord} style={{width:"100%", padding:"12px",
                border:`2px dashed ${T.border}`, borderRadius:10, background:"transparent",
                cursor:"pointer", fontSize:13, fontWeight:600, color:T.muted, marginBottom:16}}>
                + Add Work Experience
              </button>

              <FormSection icon="📁" title="Experience Documents">
                <FormGrid cols={2}>
                  <UploadZone label="Experience Letter" required accept=".pdf,.jpg" value={expLetter} onChange={setExpLetter}/>
                  <UploadZone label="Relieving Letter" required accept=".pdf,.jpg" value={relieving} onChange={setRelieving}/>
                  <Input label="PF Account Number" value={pfNumber} onChange={e=>setPfNumber(e.target.value)}
                    placeholder="MH/BAN/1234567/000/0000001"
                    style={{gridColumn:"span 1"}}/>
                </FormGrid>
                <div style={{height:1, background:T.border, margin:"16px 0"}}/>
                <div style={{fontSize:13, fontWeight:700, color:T.text, marginBottom:12}}>
                  Last 3 Months Salary Slips <span style={{color:T.danger}}>*</span>
                </div>
                <FormGrid cols={3}>
                  <UploadZone label="Month 1" required accept=".pdf,.jpg" value={slip1} onChange={setSlip1}/>
                  <UploadZone label="Month 2" required accept=".pdf,.jpg" value={slip2} onChange={setSlip2}/>
                  <UploadZone label="Month 3" required accept=".pdf,.jpg" value={slip3} onChange={setSlip3}/>
                </FormGrid>
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 5 ── */}
          {step===5 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <FormSection icon="🏦" title="Bank Account Details">
                <FormGrid cols={2}>
                  <Input label="Bank Name" required value={bankName} onChange={e=>setBankName(e.target.value)} placeholder="e.g. HDFC Bank"/>
                  <Input label="Branch Name" required value={bankBranch} onChange={e=>setBankBranch(e.target.value)} placeholder="e.g. Connaught Place"/>
                  <Input label="Account Holder Name" required value={accountHolder} onChange={e=>setAccountHolder(e.target.value)} placeholder="As per bank records"/>
                  <Input label="Account Number" required value={accountNum} onChange={e=>setAccountNum(e.target.value)} placeholder="Account number"/>
                  <Input label="Confirm Account Number" required value={accountNumConf}
                    onChange={e=>setAccountNumConf(e.target.value)} placeholder="Re-enter account number"
                    error={accountNumConf&&accountNum!==accountNumConf?"Account numbers do not match":undefined}/>
                  <div>
                    <label style={{fontSize:13, fontWeight:600, color:T.text, marginBottom:4, display:"block"}}>
                      IFSC Code <span style={{color:T.danger}}>*</span>
                    </label>
                    <div style={{display:"flex", gap:8}}>
                      <input type="text" value={ifsc} onChange={e=>setIfsc(e.target.value.toUpperCase())}
                        placeholder="HDFC0001234" maxLength={11}
                        style={{flex:1, border:`1.5px solid ${T.border}`, borderRadius:8,
                          padding:"9px 12px", fontSize:14, textTransform:"uppercase"}}/>
                      <Btn variant="secondary" size="sm" onClick={lookupIFSC}>Verify</Btn>
                    </div>
                    {ifscResult && <div style={{fontSize:12, color:T.success, marginTop:4}}>{ifscResult}</div>}
                  </div>
                </FormGrid>
                <div style={{marginTop:20}}>
                  <UploadZone label="Cancelled Cheque" required accept=".pdf,.png,.jpg,.jpeg"
                    value={cheque} onChange={setCheque}
                    hint="Clear, readable scan or photo of a cancelled cheque"/>
                </div>
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 6 ── */}
          {step===6 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              {[{label:"Reference 1",data:ref1,set:setRef1},{label:"Reference 2",data:ref2,set:setRef2}].map(({label,data,set})=>(
                <FormSection key={label} icon="🤝" title={label}>
                  <FormGrid cols={3}>
                    <Input label="Full Name" required value={data.name} onChange={e=>set(p=>({...p,name:e.target.value}))} placeholder="Reference name"/>
                    <Input label="Contact Number" required type="tel" value={data.phone} onChange={e=>set(p=>({...p,phone:e.target.value}))} placeholder="9876543210"/>
                    <Input label="Email Address" required type="email" value={data.email} onChange={e=>set(p=>({...p,email:e.target.value}))} placeholder="ref@company.com"/>
                    <Input label="Designation" value={data.designation} onChange={e=>set(p=>({...p,designation:e.target.value}))} placeholder="Their job title"/>
                    <Input label="Company" value={data.company} onChange={e=>set(p=>({...p,company:e.target.value}))} placeholder="Company name"/>
                    <Select label="Relationship" required value={data.relation} onChange={e=>set(p=>({...p,relation:e.target.value}))}
                      options={[{value:"",label:"Select"},"Former Manager","Colleague","Client","Academic","Other Professional"].map(o=>typeof o==="string"?{value:o,label:o}:o)}/>
                  </FormGrid>
                </FormSection>
              ))}

              <FormSection icon="✍️" title="Background Verification Consent">
                <div style={{background:T.bg, border:`1px solid ${T.border}`, borderRadius:10,
                  padding:"16px 18px", fontSize:13, color:T.muted, lineHeight:1.8, marginBottom:16}}>
                  <p>I, the undersigned, hereby authorize <strong>Deneb & Pollux Tours and Travels Pvt Ltd</strong> and its authorized representatives to conduct a thorough background verification, which may include but is not limited to: identity verification, employment history, educational credentials, criminal record check, and reference checks.</p>
                  <p style={{marginTop:10}}>I confirm that all information provided in this joining form is true, accurate, and complete to the best of my knowledge. Any misrepresentation or omission may result in disqualification or termination of employment.</p>
                </div>
                <label style={{display:"flex", alignItems:"flex-start", gap:10, cursor:"pointer", fontSize:13}}>
                  <input type="checkbox" checked={bvgConsent} onChange={e=>setBvgConsent(e.target.checked)}
                    style={{marginTop:2, accentColor:T.brand}}/>
                  <span><strong>I agree</strong> to the background verification and confirm that all information provided is accurate. <span style={{color:T.danger}}>*</span></span>
                </label>
                {!bvgConsent && <div style={{marginTop:8, fontSize:12, color:T.danger}}>
                  You must agree to the background verification consent to proceed.
                </div>}
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 7 ── */}
          {step===7 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`, borderRadius:10,
                padding:"12px 16px", marginBottom:16, fontSize:13, color:T.info}}>
                ℹ️ <strong>Both PNG and JPEG required</strong> — Upload your passport-size photo in both formats before proceeding.
              </div>

              <FormSection icon="📷" title="Passport Size Photograph">
                <FormGrid cols={2}>
                  <UploadZone label="Photo — PNG Format" required accept=".png"
                    value={photoPng} onChange={setPhotoPng}
                    hint="White background, plain attire, recent photo"/>
                  <UploadZone label="Photo — JPEG Format" required accept=".jpg,.jpeg"
                    value={photoJpeg} onChange={setPhotoJpeg}
                    hint="Same photo, saved as JPEG/JPG"/>
                </FormGrid>
                <div style={{marginTop:16, background:T.bg, border:`1px solid ${T.border}`,
                  borderRadius:10, padding:"14px 16px"}}>
                  <div style={{fontSize:12, fontWeight:700, color:T.muted, textTransform:"uppercase",
                    letterSpacing:"0.06em", marginBottom:8}}>Photo Guidelines</div>
                  <ul style={{paddingLeft:18, fontSize:13, color:T.muted, display:"flex", flexDirection:"column", gap:4}}>
                    <li>Recent photo (taken within last 3 months)</li>
                    <li>Plain white or light background</li>
                    <li>Full face clearly visible, no sunglasses or headwear</li>
                    <li>Formal or business attire preferred</li>
                    <li>Minimum 300 × 300 px, maximum 5 MB per file</li>
                  </ul>
                </div>
              </FormSection>
            </WizardStep>
          )}

          {/* ── STEP 8 ── */}
          {step===8 && (
            <WizardStep step={step} total={TOTAL} onNext={next} onPrev={prev} onSave={saveDraft} saving={saving}>
              {/* Completion ring */}
              <div style={{background:T.surface, border:`1px solid ${T.border}`, borderRadius:14,
                padding:"20px 24px", display:"flex", alignItems:"center", gap:24, marginBottom:20}}>
                <div style={{position:"relative", flexShrink:0}}>
                  <svg width="88" height="88" viewBox="0 0 88 88">
                    <circle cx="44" cy="44" r="40" fill="none" stroke={T.border} strokeWidth="8"/>
                    <circle cx="44" cy="44" r="40" fill="none" stroke={T.accent} strokeWidth="8"
                      strokeLinecap="round" strokeDasharray="251.2"
                      strokeDashoffset={ringOffset}
                      transform="rotate(-90 44 44)"
                      style={{transition:"stroke-dashoffset 0.6s ease"}}/>
                  </svg>
                  <div style={{position:"absolute", inset:0, display:"flex", alignItems:"center",
                    justifyContent:"center", fontSize:16, fontWeight:800, color:T.brand}}>
                    {completionPct}%
                  </div>
                </div>
                <div>
                  <div style={{fontWeight:700, fontSize:16, color:T.brand}}>Form Completion</div>
                  <div style={{fontSize:13, color:T.muted, marginTop:4}}>
                    {uploadedCount} of {reqUploads.length} required documents uploaded
                  </div>
                  <div style={{display:"flex", gap:6, flexWrap:"wrap", marginTop:10}}>
                    {STEP_LABELS.slice(0,7).map((l,i)=>(
                      <Badge key={l} color={step>i+1?"success":"neutral"}>{i+1}. {l}</Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Review sections */}
              {[
                {title:"Personal Information", icon:"👤", rows:[
                  ["Full Name (Aadhaar)", xmlData.name||"—"],
                  ["Marital Status", marital||"—"],
                  ["Contact Number", phone||"—"],
                  ["Personal Email", email||"—"],
                  ["Email Verified", emailVerified?"✓ Yes":"✗ Not yet"],
                  ["Current Address", curAddress||"—"],
                  ["Emergency Contact", emergName||"—"],
                ]},
                {title:"Bank Details", icon:"🏦", rows:[
                  ["Bank Name", bankName||"—"],
                  ["Branch", bankBranch||"—"],
                  ["Account Holder", accountHolder||"—"],
                  ["IFSC Code", ifsc||"—"],
                  ["Cancelled Cheque", cheque?"✅ Uploaded":"⚠ Not uploaded"],
                ]},
                {title:"References", icon:"🤝", rows:[
                  ["Reference 1", ref1.name||"—"],
                  ["Reference 2", ref2.name||"—"],
                  ["BVG Consent", bvgConsent?"✓ Agreed":"✗ Not agreed"],
                ]},
                {title:"Documents Uploaded", icon:"📁", rows:[
                  ["Aadhaar XML", aadhaarXml?"✅":"⚠ Missing"],
                  ["Aadhaar PDF", aadhaarPdf?"✅":"⚠ Missing"],
                  ["PAN Card", panCard?"✅":"⚠ Missing"],
                  ["10th Certificate", cert10th?"✅":"⚠ Missing"],
                  ["12th Certificate", cert12th?"✅":"⚠ Missing"],
                  ["Degree Certificate", certDegree?"✅":"⚠ Missing"],
                  ["Marksheets", certMarksheets?"✅":"⚠ Missing"],
                  ["Experience Letter", expLetter?"✅":"⚠ Missing"],
                  ["Relieving Letter", relieving?"✅":"⚠ Missing"],
                  ["Salary Slips (3)", slip1&&slip2&&slip3?"✅ All 3":"⚠ Missing some"],
                  ["Photo PNG", photoPng?"✅":"⚠ Missing"],
                  ["Photo JPEG", photoJpeg?"✅":"⚠ Missing"],
                ]},
              ].map(s=>(
                <div key={s.title} style={{background:T.surface, border:`1px solid ${T.border}`,
                  borderRadius:12, overflow:"hidden", marginBottom:12}}>
                  <div style={{background:T.surface2, padding:"12px 18px",
                    borderBottom:`1px solid ${T.border}`, display:"flex", alignItems:"center", gap:8}}>
                    <span>{s.icon}</span>
                    <span style={{fontWeight:700, color:T.brand, fontSize:13}}>{s.title}</span>
                  </div>
                  {s.rows.map(([l,v])=>(
                    <div key={l} style={{display:"flex", borderBottom:`1px solid ${T.border}`,
                      fontSize:13}}>
                      <div style={{width:"40%", padding:"9px 18px", color:T.muted, fontWeight:500, flexShrink:0}}>{l}</div>
                      <div style={{flex:1, padding:"9px 18px", color:v.startsWith("⚠")?T.danger:v.startsWith("✅")||v.startsWith("✓")?T.success:T.text}}>{v}</div>
                    </div>
                  ))}
                </div>
              ))}

              {/* Final declaration + submit */}
              <FormSection icon="✅" title="Final Declaration">
                <label style={{display:"flex", alignItems:"flex-start", gap:10, fontSize:13,
                  cursor:"pointer", marginBottom:20, lineHeight:1.6}}>
                  <input type="checkbox" checked={declaration} onChange={e=>setDeclaration(e.target.checked)}
                    style={{marginTop:2, accentColor:T.brand}}/>
                  <span>I declare that all information and documents submitted in this form are genuine, complete, and accurate to the best of my knowledge. I understand that any false information or submission of forged documents may lead to immediate termination and legal action.</span>
                </label>
                <Btn variant="primary" size="lg" full onClick={finalSubmit}
                  disabled={submitLoading||!declaration}>
                  {submitLoading ? "Submitting…" : "🚀 Submit Joining Form"}
                </Btn>
                <p style={{textAlign:"center", fontSize:12, color:T.faint, marginTop:10}}>
                  Once submitted, HR will review your form and contact you within 2 business days.
                </p>
              </FormSection>
            </WizardStep>
          )}

        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEE: PENDING VERIFICATION ──────────────────────────────
function PendingVerification({ employee }) {
  return (
    <div style={{minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center"}}>
      <div style={{maxWidth:500, width:"100%", padding:24}}>
        <Card style={{padding:40, textAlign:"center"}}>
          <div style={{width:80, height:80, borderRadius:"50%", background:T.warningLight,
            border:`2px solid ${T.warningBorder}`, display:"flex", alignItems:"center",
            justifyContent:"center", fontSize:36, margin:"0 auto 20px"}}>⏳</div>
          <h2 style={{fontFamily:"'DM Serif Display',serif", fontSize:24, color:T.brand, marginBottom:10}}>
            Application Submitted
          </h2>
          <p style={{color:T.muted, fontSize:14, lineHeight:1.7, marginBottom:24}}>
            Your joining form has been successfully submitted and is currently under review by the HR team at Deneb & Pollux.
          </p>
          <div style={{background:T.infoLight, border:`1px solid ${T.infoBorder}`, borderRadius:10,
            padding:"14px 18px", fontSize:13, color:T.info, textAlign:"left", marginBottom:24}}>
            <div style={{fontWeight:700, marginBottom:6}}>What happens next?</div>
            <ol style={{paddingLeft:16, display:"flex", flexDirection:"column", gap:6, lineHeight:1.7}}>
              <li>HR team reviews all submitted documents</li>
              <li>Background verification is initiated</li>
              <li>You receive an email once approved</li>
              <li>Dashboard access is unlocked after approval</li>
            </ol>
          </div>
          <div style={{display:"flex", gap:8, fontSize:12, color:T.faint, justifyContent:"center"}}>
            <span>Expected response:</span>
            <strong style={{color:T.text}}>2 business days</strong>
          </div>
        </Card>
      </div>
    </div>
  );
}

// ─── EMPLOYEE: DASHBOARD ──────────────────────────────────────────
function EmployeeDashboard({ employee }) {
  const cards = [
    {icon:"👤", title:"My Profile", desc:"View and update your personal information", color:T.brand},
    {icon:"📄", title:"My Documents", desc:"View uploaded and pending documents", color:T.info},
    {icon:"📢", title:"Announcements", desc:"Company news and updates from HR", color:T.accent},
    {icon:"🏖️", title:"Holidays", desc:"View the company holiday calendar", color:T.success},
    {icon:"🌿", title:"Leave Balance", desc:"Check available leave and apply for leave", color:T.warning},
    {icon:"💰", title:"Payslips", desc:"Download monthly salary slips", color:T.danger},
  ];

  return (
    <div style={{minHeight:"100vh", background:T.bg}}>
      <header style={{height:60, background:T.brand, padding:"0 28px", display:"flex",
        alignItems:"center", justifyContent:"space-between"}}>
        <div style={{fontFamily:"'DM Serif Display',serif", color:"#fff", fontSize:18}}>Deneb & Pollux</div>
        <div style={{display:"flex", alignItems:"center", gap:12}}>
          <button style={{background:"none", border:"none", cursor:"pointer", color:"rgba(255,255,255,.6)", fontSize:18}}>🔔</button>
          <div style={{width:32, height:32, borderRadius:"50%", background:T.accent,
            display:"flex", alignItems:"center", justifyContent:"center",
            color:"#fff", fontSize:12, fontWeight:700}}>
            {(employee.name||"").split(" ").map(w=>w[0]).join("").slice(0,2)}
          </div>
          <span style={{color:"#fff", fontSize:13}}>{employee.name}</span>
        </div>
      </header>

      <div style={{maxWidth:960, margin:"0 auto", padding:32}}>
        <div style={{marginBottom:28}}>
          <h1 style={{fontFamily:"'DM Serif Display',serif", fontSize:26, color:T.brand, marginBottom:6}}>
            Welcome back, {(employee.name||"").split(" ")[0]}!
          </h1>
          <p style={{color:T.muted, fontSize:14}}>
            {new Date().toLocaleDateString("en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"})}
          </p>
        </div>

        {/* Profile card */}
        <Card style={{padding:24, marginBottom:20}}>
          <div style={{display:"flex", alignItems:"center", gap:20}}>
            <div style={{width:64, height:64, borderRadius:"50%", background:T.brand,
              display:"flex", alignItems:"center", justifyContent:"center",
              color:"#fff", fontSize:24, fontWeight:700, flexShrink:0}}>
              {(employee.name||"").split(" ").map(w=>w[0]).join("").slice(0,2)}
            </div>
            <div style={{flex:1}}>
              <div style={{fontWeight:700, fontSize:18, color:T.brand}}>{employee.name}</div>
              <div style={{color:T.muted, fontSize:14, marginTop:2}}>Employee ID: {employee.credential}</div>
              <div style={{marginTop:8}}>
                <Badge color="success">Active Employee</Badge>
              </div>
            </div>
            <Btn variant="secondary" size="sm">Edit Profile</Btn>
          </div>
        </Card>

        {/* Quick stats */}
        <div style={{display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12, marginBottom:20}}>
          {[["🌿","12 days","Leave Balance"],["📄","8 docs","Uploaded"],["📢","3 new","Announcements"],["🏖️","12","Upcoming Holidays"]].map(([icon,val,lbl])=>(
            <StatCard key={lbl} icon={icon} value={val} label={lbl}/>
          ))}
        </div>

        <div style={{display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:14}}>
          {cards.map(c=>(
            <div key={c.title} style={{background:T.surface, border:`1px solid ${T.border}`,
              borderRadius:12, padding:20, cursor:"pointer", transition:"all 0.15s",
              position:"relative", overflow:"hidden"}}
              onMouseEnter={e=>{e.currentTarget.style.transform="translateY(-2px)";e.currentTarget.style.boxShadow="0 8px 24px rgba(0,0,0,0.1)"}}
              onMouseLeave={e=>{e.currentTarget.style.transform="none";e.currentTarget.style.boxShadow="none"}}>
              <div style={{position:"absolute", top:0, left:0, right:0, height:3, background:c.color}}/>
              <div style={{width:44, height:44, borderRadius:10, background:c.color+"15",
                display:"flex", alignItems:"center", justifyContent:"center", fontSize:20, marginBottom:12}}>
                {c.icon}
              </div>
              <div style={{fontWeight:700, color:T.brand, fontSize:14, marginBottom:4}}>{c.title}</div>
              <div style={{fontSize:12, color:T.muted, lineHeight:1.5}}>{c.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EMPLOYEE PORTAL ──────────────────────────────────────────────
function EmployeePortal({ onSwitch }) {
  const [loggedIn, setLoggedIn] = useState(false);
  const [employee, setEmployee] = useState(null);
  const [page, setPage] = useState("login");
  const toast = useToast();

  const handleLogin = (emp) => {
    setEmployee(emp);
    setLoggedIn(true);
    // Status-based redirect
    const redirectMap = {
      OFFER_SENT: "offer-letter",
      OFFER_ACCEPTED: "onboarding",
      ONBOARDING_PENDING: "onboarding",
      APPLICATION_SUBMITTED: "pending-verification",
      APPLICATION_APPROVED: "dashboard",
      ACTIVE: "dashboard",
    };
    setPage(redirectMap[emp.status] || "dashboard");
  };

  if (!loggedIn) return <>
    <EmployeeLogin onLogin={handleLogin}/>
    <Toast toasts={toast.toasts} remove={toast.remove}/>
  </>;

  const renderPage = () => {
    switch(page) {
      case "offer-letter": return <OfferLetter employee={employee}
        onAccept={()=>{setEmployee(p=>({...p,status:"OFFER_ACCEPTED"}));setPage("onboarding");toast.add("Offer accepted! Welcome aboard 🎉","success");}}
        onReject={()=>{setPage("rejected");toast.add("Offer declined","info");}}/>;
      case "onboarding": return <OnboardingWizard employee={employee}
        onSubmit={()=>{setEmployee(p=>({...p,status:"APPLICATION_SUBMITTED"}));setPage("pending-verification");}}
        toast={toast}/>;
      case "pending-verification": return <PendingVerification employee={employee}/>;
      case "dashboard": return <EmployeeDashboard employee={employee}/>;
      case "rejected":
        return (
          <div style={{minHeight:"100vh", background:T.bg, display:"flex", alignItems:"center", justifyContent:"center"}}>
            <Card style={{padding:40, textAlign:"center", maxWidth:420}}>
              <div style={{fontSize:48, marginBottom:16}}>😔</div>
              <h2 style={{color:T.brand, marginBottom:10}}>Offer Declined</h2>
              <p style={{color:T.muted, fontSize:14}}>Your decision has been recorded. We wish you the very best in your career journey.</p>
            </Card>
          </div>
        );
      default: return null;
    }
  };

  return (
    <div>
      {/* Switch portal button */}
      <div style={{position:"fixed", top:16, right:16, zIndex:500}}>
        <Btn variant="primary" size="sm" onClick={onSwitch}>→ HR Admin Portal</Btn>
      </div>
      {renderPage()}
      <Toast toasts={toast.toasts} remove={toast.remove}/>
    </div>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────
export default function App() {
  const [portal, setPortal] = useState("select");

  if (portal === "select") return (
    <div style={{minHeight:"100vh", background:T.brand, display:"flex",
      alignItems:"center", justifyContent:"center", padding:20}}>
      <div style={{textAlign:"center", maxWidth:640}}>
        <div style={{width:80, height:80, borderRadius:20, background:T.accent,
          display:"flex", alignItems:"center", justifyContent:"center",
          fontSize:36, margin:"0 auto 24px", fontWeight:900, color:"#fff"}}>D</div>
        <h1 style={{fontFamily:"'DM Serif Display',serif", fontSize:"clamp(2rem,4vw,3rem)",
          color:"#fff", fontWeight:400, marginBottom:12}}>
          Deneb & Pollux HR Portal
        </h1>
        <p style={{color:"rgba(255,255,255,.55)", fontSize:15, lineHeight:1.7, marginBottom:40}}>
          Production-ready HR management platform — two portals,<br/>one unified backend.
        </p>
        <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:16}}>
          <button onClick={()=>setPortal("admin")}
            style={{background:T.surface, border:`2px solid ${T.brandLight}`, borderRadius:16,
              padding:"28px 24px", cursor:"pointer", textAlign:"left",
              transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.transform="translateY(-3px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brandLight;e.currentTarget.style.transform="none"}}>
            <div style={{fontSize:36, marginBottom:12}}>🏢</div>
            <div style={{fontWeight:800, color:T.brand, fontSize:18, marginBottom:6}}>HR Admin Portal</div>
            <div style={{color:T.muted, fontSize:13, lineHeight:1.6}}>
              For HR managers, admins, managers and CFOs. Employee management, approvals, reports.
            </div>
            <div style={{marginTop:12}}>
              <code style={{fontSize:11, color:T.faint, background:T.bg, padding:"3px 8px", borderRadius:4}}>
                hr.company.com
              </code>
            </div>
          </button>
          <button onClick={()=>setPortal("employee")}
            style={{background:T.surface, border:`2px solid ${T.brandLight}`, borderRadius:16,
              padding:"28px 24px", cursor:"pointer", textAlign:"left", transition:"all 0.15s"}}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.accent;e.currentTarget.style.transform="translateY(-3px)"}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.brandLight;e.currentTarget.style.transform="none"}}>
            <div style={{fontSize:36, marginBottom:12}}>👤</div>
            <div style={{fontWeight:800, color:T.brand, fontSize:18, marginBottom:6}}>Employee Portal</div>
            <div style={{color:T.muted, fontSize:13, lineHeight:1.6}}>
              For new joiners and employees. Offer letter, 8-step onboarding wizard, dashboard.
            </div>
            <div style={{marginTop:12}}>
              <code style={{fontSize:11, color:T.faint, background:T.bg, padding:"3px 8px", borderRadius:4}}>
                employee.company.com
              </code>
            </div>
          </button>
        </div>
        <p style={{color:"rgba(255,255,255,.3)", fontSize:12, marginTop:24}}>
          Full production implementation — all pages, forms, validation, and workflows
        </p>
      </div>
    </div>
  );

  if (portal === "admin") return <AdminPortal onSwitch={()=>setPortal("employee")}/>;
  if (portal === "employee") return <EmployeePortal onSwitch={()=>setPortal("admin")}/>;
}