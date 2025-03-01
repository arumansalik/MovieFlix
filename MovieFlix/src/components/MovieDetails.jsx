import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Spinner from "./Spinner";

const API_BASE_URL = "https://api.themoviedb.org/3";
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const API_OPTIONS = {
    method: "GET",
    headers: {
        accept: "application/json",
        Authorization: `Bearer ${API_KEY}`,
    },
};

const MovieDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [movieDetails, setMovieDetails] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState("");

    const fetchMovieDetails = async () => {
        setIsLoading(true);
        setErrorMessage("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/movie/${id}?api_key=${API_KEY}`,
                API_OPTIONS
            );
            if (!response.ok) {
                throw new Error("Failed to fetch movie details");
            }

            const data = await response.json();
            setMovieDetails(data);
        } catch (error) {
            setErrorMessage("Error fetching movie details. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMovieDetails();
    }, [id]);

    if (isLoading) {
        return <Spinner />;
    }

    if (errorMessage) {
        return <p>{errorMessage}</p>;
    }

    // Function to display the star rating
    const renderStars = (rating) => {
        const stars = [];
        for (let i = 0; i < 5; i++) {
            stars.push(
                <svg
                    key={i}
                    xmlns="http://www.w3.org/2000/svg"
                    fill={i < Math.round(rating / 2) ? "#FFD700" : "#ddd"}
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                >
                    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                </svg>
            );
        }
        return stars;
    };

    return (
        <div className="movie-details bg-gray-900 p-8 rounded-lg shadow-xl max-w-7xl mx-auto mt-10">
            <button
                onClick={() => navigate("/")}
                className="text-white bg-purple-600 py-2 px-4 rounded-lg mb-6"
            >
                Back to Movie List
            </button>
            <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Movie Poster */}
                <div className="flex-shrink-0">
                    <img
                        src={`https://image.tmdb.org/t/p/w500/${movieDetails.poster_path}`}
                        alt={movieDetails.title}
                        className="w-72 h-auto rounded-lg shadow-lg"
                    />
                </div>

                {/* Movie Details Section */}
                <div className="text-white flex flex-col gap-4">
                    <h2 className="text-4xl font-bold text-gray-100">{movieDetails.title}</h2>
                    <p className="text-lg">{movieDetails.overview}</p>

                    <div className="flex items-center gap-4 mt-4">
                        <p className="font-semibold text-lg text-gray-300">
                            Release Date: {movieDetails.release_date}
                        </p>
                        <div className="flex items-center gap-2">
                            <p className="font-semibold text-lg text-gray-300">Rating:</p>
                            <div className="flex gap-1">{renderStars(movieDetails.vote_average)}</div>
                        </div>
                    </div>

                    {/* Genre Cards */}
                    <div className="mt-6">
                        <p className="font-semibold text-lg text-gray-300">Genres:</p>
                        <div className="flex gap-4 mt-2 flex-wrap">
                            {movieDetails.genres.map((genre) => (
                                <div
                                    key={genre.id}
                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg shadow-md hover:scale-105 transition-transform"
                                >
                                    {genre.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MovieDetails;
