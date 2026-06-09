import { FiBell, FiBox, FiCalendar, FiGrid, FiHeadphones, FiHome, FiPackage, FiPieChart, FiSettings, FiShoppingCart, FiTrendingUp, FiUsers } from "react-icons/fi";
import { products, rupiah } from "@/lib/snap-data";

const nav = [
  ["Dashboard", FiGrid],
  ["Products", FiPackage],
  ["Inventory", FiBox],
  ["Orders", FiShoppingCart],
  ["Branches", FiHome],
  ["Vouchers", FiPieChart],
  ["Customers", FiUsers],
  ["Reports", FiTrendingUp],
  ["Settings", FiSettings]
] as const;

export function SnapAdminDashboard() {
  return (
    <main className="admin-capture">
      <aside className="admin-sidebar">
        <h1>MARKET SNAP</h1>
        <nav>{nav.map(([label, Icon], index) => <a className={index === 0 ? "active" : ""} href="#" key={label}><Icon /> {label}</a>)}</nav>
        <div className="upgrade-card"><img alt="" src="/product.png" /><h3>Grow your business</h3><p>Add more branches and promos to reach customers.</p><button type="button">Upgrade Plan</button></div>
        <div className="support-card"><FiHeadphones /><strong>Butuh bantuan?</strong><button type="button">Hubungi Support</button></div>
      </aside>
      <section className="admin-main">
        <header className="admin-topbar">
          <input placeholder="Search products, orders, customers..." />
          <div><FiBell /><span>Admin<small>Super Admin</small></span></div>
        </header>
        <div className="admin-title"><div><h2>Dashboard</h2><p>Welcome back, Admin! Here is what is happening with your store today.</p></div><button type="button"><FiCalendar /> 20 Mei - 26 Mei 2025</button></div>
        <section className="admin-metrics">
          <Metric title="Total Sales" value="Rp 256.890.000" trend="18.6%" icon={<FiTrendingUp />} />
          <Metric title="Total Orders" value="1.248" trend="12.4%" icon={<FiShoppingCart />} />
          <Metric title="Active Products" value="892" trend="5.7%" icon={<FiBox />} />
          <Metric title="Branch Stock Alerts" value="18" trend="8" icon={<FiBell />} warn />
        </section>
        <section className="admin-two">
          <article className="chart-card"><h3>Sales Overview</h3><strong>Rp 256.890.000</strong><div className="line-chart">{[14, 34, 53, 42, 64, 55, 80].map((height, index) => <span style={{ height: `${height}%` }} key={index} />)}</div></article>
          <article className="recent-card"><h3>Recent Orders</h3>{["Budi Santoso", "Siti Aminah", "Dewi Lestari", "Tono Wijaya", "Rina Handayani"].map((name, index) => <p key={name}><span>#MS-250526-00{index + 1}</span><b>{name}</b><strong>{rupiah([248500, 189000, 315000, 92000, 276000][index])}</strong><em>{index % 2 ? "Diproses" : "Selesai"}</em></p>)}</article>
        </section>
        <section className="admin-two">
          <article className="recent-card"><h3>Low Stock Products</h3>{products.slice(0, 5).map((product) => <p key={product.id}><img alt="" src={product.image} /><b>{product.name}</b><span>{product.category}</span><strong>{product.stock}</strong><em>{product.stock < 30 ? "Kritis" : "Rendah"}</em></p>)}</article>
          <article className="branch-performance"><h3>Branch Performance</h3>{["Kemang", "Bangka", "Prapatan", "Rawamangun"].map((branch, index) => <div key={branch}><img alt="" src="/market-snap-favicon-transparent.png" /><h4>{branch}</h4><p>Jakarta Selatan</p><strong>{rupiah([98450000, 67320000, 54780000, 36340000][index])}</strong><span>Naik {[16.2, 11.4, 9.8, 7.3][index]}%</span></div>)}</article>
        </section>
        <section className="voucher-performance">
          <h3>Voucher Performance</h3>
          <div className="donut"><span>Total Usage<br /><strong>2.842</strong></span></div>
          <div className="voucher-table">{["SNAPWELCOME", "GRATISONGKIR", "BOGOGREEN", "HEMAT20"].map((code, index) => <p key={code}><b>{code}</b><span>{index === 1 ? "Gratis Ongkir" : "20% off"}</span><strong>{[1024, 892, 568, 358][index]}</strong><em>{index === 3 ? "Nonaktif" : "Aktif"}</em></p>)}</div>
        </section>
      </section>
    </main>
  );
}

function Metric({ title, value, trend, icon, warn }: { title: string; value: string; trend: string; icon: React.ReactNode; warn?: boolean }) {
  return <article className="admin-metric"><span className={warn ? "warn" : ""}>{icon}</span><p>{title}</p><strong>{value}</strong><small>{warn ? "Turun" : "Naik"} {trend} vs last week</small></article>;
}
