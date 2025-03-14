import { useEffect, useState } from "react";
import { useDebounce } from "react-use";
import { gsap } from "gsap";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MovieCard from "./components/MovieCard";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieDetails from "./components/MovieDetails";
import { Spotlight } from "./components/ui/spotlight-new";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [movieList, setMovieList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

  useDebounce(() => setDebouncedSearchTerm(searchTerm), 500, [searchTerm]);

  const fetchMovies = async (query = "") => {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const endpoint = query
          ? `${API_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
          : `${API_BASE_URL}/discover/movie?sort_by=popularity.desc`;

      const response = await fetch(endpoint, API_OPTIONS);

      if (!response.ok) {
        throw new Error("Failed to fetch movies");
      }

      const data = await response.json();

      if (data.Response === "False") {
        setErrorMessage(data.Error || "Failed to fetch movies");
        setMovieList([]);
        return;
      }

      setMovieList(data.results || []);
    } catch (error) {
      console.error(`Error fetching the movies: ${error}`);
      setErrorMessage("Error fetching the movies. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearchTerm);
  }, [debouncedSearchTerm]);

  useEffect(() => {
    // GSAP Animations for page elements
    gsap.from("header h1 span", {
      opacity: 0,
      y: -50,
      duration: 1.5,
      ease: "power3.out",
    });

    gsap.from(".movie-card", {
      opacity: 0,
      y: 50,
      stagger: 0.1,
      duration: 1.5,
      ease: "power3.out",
    });
  }, []);

  return (
      <Router>
        <Routes>
          {/* Home page route */}
          <Route
              path="/"
              element={
                <main>
                  <div className="bg-hero-pattern w-screen h-screen bg-center bg-cover absolute z-0" />
                  <Spotlight />
                  <div className="px-5 py-12 xs:p-10 max-w-7xl mx-auto flex flex-col relative z-10">
                    <header>
                      <img src="./hero.png" alt="Hero Banner" />
                      <h1>
                        CineMatch:{" "}
                        <span className="bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] bg-clip-text">
                      Unearth Perfect Films
                    </span>{" "}
                        Without the Hunt
                      </h1>
                    </header>
                    <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
                    <section className="space-y-9">
                      <h2 className="mt-[40px]">All Movies</h2>
                      {isLoading ? (
                          <Spinner />
                      ) : errorMessage ? (
                          <p className="text-red-500">{errorMessage}</p>
                      ) : (
                          <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-5">
                            {movieList.map((movie) => (
                                <MovieCard key={movie.id} movie={movie}/>
                            ))}
                          </ul>
                      )}
                    </section>
                  </div>
                </main>
              }
          />
          {/* Movie details page route */}
          <Route path="/movie/:id" element={<MovieDetails />} />
        </Routes>
      </Router>
  );
};

export default App;
