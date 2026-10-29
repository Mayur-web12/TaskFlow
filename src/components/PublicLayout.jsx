
import { Outlet } from 'react-router-dom';
import Footer from './Footer';

const PublicLayout = () => {
  return (
    <div className="public-layout">
      <main className="public-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default PublicLayout;
