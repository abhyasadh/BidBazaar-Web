import React, { useEffect, useState } from "react";
import {
  ArrowRight2,
  SearchNormal,
  Home2,
  Save2,
  Judge,
  Setting2,
  Notification,
  AddSquare,
  Add,
} from "iconsax-react";
import "react-range-slider-input/dist/style.css";
import { useFilter } from "./context/FilterContext";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import NavButton from "./components/NavButton";
import Post from "./pages/Post";
import FilteredItems from "./pages/FilteredItems";
import Report from "./components/Report";
import ShareModal from "./components/Share";
import Filter from "./pages/Filter";
import { io } from "socket.io-client";

const Home = () => {
  const { filter } = useFilter();
  const location = useLocation();
  const navigate = useNavigate();

  const [searchValue, setSearchValue] = useState("");

  const [isHidden, setIsHidden] = useState(false);

  useEffect(() => {
    let lastScrollTop = 0;
    const handleScroll = () => {
      const st = window.scrollY || document.documentElement.scrollTop;
      if (Math.abs(lastScrollTop - st) <= 10) return;

      if (st > lastScrollTop && lastScrollTop > 0) {
        setIsHidden(true);
      } else {
        setIsHidden(false);
      }
      lastScrollTop = st;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const socket = io("http://localhost:3000");
  
    useEffect(() => {
      socket.connect();
  
      return () => {
        socket.disconnect();
      };
    }, [socket]);

  return (
    <div className="home">
      {!location.pathname.startsWith("/item", 0) && (
        <nav className="nav">
          <div className="buttons">
            <NavButton label="Home" icon={<Home2 />} to="/" />
            <NavButton label="Saved" icon={<Save2 />} to="/saved" />
            <NavButton label="My Bids" icon={<Judge />} to="/bids" />
            <NavButton label="Settings" icon={<Setting2 />} to="/settings" />
          </div>
        </nav>
      )}
      {!location.pathname.startsWith("/settings") && (
        <header className="header" style={{ top: isHidden ? "-102px" : "0" }}>
          <div className="logo-div" onClick={() => navigate("/")}>
            <img
              src="https://res.cloudinary.com/dprvuiiat/image/upload/v1740547105/Logo/logo_trans_sgpgeh.png"
              alt="logo"
              style={{ height: "100%" }}
            />
          </div>
          <div className="search-div">
            <div className="input-container">
              <div className="icon-container">
                <span>
                  <SearchNormal color="grey" size={20} />
                </span>
              </div>
              <input
                autoComplete="off"
                id="search-input"
                type="text"
                placeholder={`Search ${
                  location.pathname !== "/settings" ? "Items" : "Settings"
                }...`}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    setSearchValue(e.target.value);
                    document.querySelector(".input-container :focus")?.blur();
                  }
                }}
              />
              {searchValue !== "" &&
              document.getElementById("search-input") !==
                document.activeElement ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue("");
                    document.getElementById("search-input").value = "";
                    document.getElementById("search-input").focus();
                  }}
                >
                  <Add
                    color="grey"
                    size={28}
                    style={{ transform: "rotate(45deg)" }}
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => {
                    setSearchValue(
                      document.getElementById("search-input").value
                    );
                    document.querySelector(".input-container :focus")?.blur();
                  }}
                >
                  <ArrowRight2 color="grey" size={20} />
                </button>
              )}
            </div>
          </div>

          <div className="filter-div">
            <button
              className={`filter-button ${filter.applied ? "active" : ""}`}
              onClick={() => {
                document.getElementById("filter-modal").showModal();
              }}
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M5.40002 2.09998H18.6C19.7 2.09998 20.6 2.99998 20.6 4.09998V6.29998C20.6 7.09998 20.1 8.09998 19.6 8.59998L15.3 12.4C14.7 12.9 14.3 13.9 14.3 14.7V19C14.3 19.6 13.9 20.4 13.4 20.7L12 21.6C10.7 22.4 8.90002 21.5 8.90002 19.9V14.6C8.90002 13.9 8.50002 13 8.10002 12.5L4.30002 8.49998C3.80002 7.99998 3.40002 7.09998 3.40002 6.49998V4.19998C3.40002 2.99998 4.30002 2.09998 5.40002 2.09998Z"
                  stroke="grey"
                  strokeWidth="1.5"
                  strokeMiterlimit="10"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Filters
            </button>
          </div>
          <div
            style={{
              display: "flex",
              gap: "16px",
              marginLeft: "auto",
              marginRight: "10px",
            }}
          >
            <button
              className="add-button"
              onClick={() => {
                document.getElementById("new-post").showModal();
              }}
            >
              <AddSquare
                color="var(--inverted-text-color)"
                size={24}
                variant={"Bold"}
              />
              <span style={{ color: "var(--inverted-text-color)" }}>Post</span>
            </button>
            <div className="filter-div">
              <button style={{ padding: "0 10px" }}>
                <Notification size={26} color="grey" />
              </button>
            </div>
          </div>
        </header>
      )}
      <div
        className="dashboard-container"
        style={{
          margin: `${
            location.pathname.startsWith("/settings") ? "30px" : "102px"
          } 30px 20px 120px`,
        }}
      >
        {filter.applied ? <FilteredItems /> : <Outlet />}
      </div>
      <Post />
      <Filter />
      <Report />
      <ShareModal />
    </div>
  );
};

export default Home;
