import { Outlet, useLocation } from "react-router-dom";
import NavTop from "./NavTop";
import Footer from "./footer/Footer";

function Layout() {
	const location = useLocation();
	const { pathname } = location;

	return (
		<main className="w-full min-h-screen flex flex-col">
			<div className={`min-h-full h-full`}>
				<NavTop />
			</div>
			<div className="h-[calc(100vh-280px)]">
				<Outlet />
			</div>
			<div>
				<Footer />
			</div>
		</main>
	);
}

export default Layout;
