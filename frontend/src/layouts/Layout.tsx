import Footer from
 
"../components/Footer";
import Header from
 
"../components/Header";
import Hero from
 
"../components/Hero";
import SearchBar from "../components/SearchBar";

interface Props {
  children: React.ReactNode;
  isSignInPage: boolean; // New prop to indicate the sign-in page
}

const Layout = ({ children, isSignInPage }: Props) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <Hero />
      {!isSignInPage && ( // Conditionally render SearchBar
        <div className="container mx-auto">
          <SearchBar />
        </div>
      )}
      <div className="container mx-auto py-10 flex-1">{children}</div>
      <Footer />
    </div>
  );
};

export default Layout;