import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const MovieCard = ({ movie: { id, title, vote_average, poster_path, release_date, original_language } }) => {
    return (
        <motion.div
            className="bg-dark-100 p-5 rounded-2xl shadow-inner shadow-light-100/10 cursor-pointer"
            whileHover={{
                scale: 1.1,
                boxShadow: "0px 10px 20px rgba(255, 255, 255, 0.15)",
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
        >
            <Link to={`/movie/${id}`}>
                <img
                    src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : "/no-movie.png"}
                    alt={title}
                    className="rounded-lg h-auto w-full"
                />
            </Link>
            <div className="mt-4">
                <h3 className="text-white font-bold text-base line-clamp-1">{title}</h3>
                <div className="mt-2 flex flex-row items-center flex-wrap gap-2">
                    <div className="flex flex-row items-center gap-1">
                        <img src="star.svg" alt="Star Icon" className="size-4 object-contain" />
                        <p className="font-bold text-base text-white">
                            {vote_average ? vote_average.toFixed(1) : "N/A"}
                        </p>
                    </div>
                    <span className="text-sm text-gray-100">•</span>
                    <p className="capitalize text-gray-100 font-medium text-base">{original_language}</p>
                    <span className="text-sm text-gray-100">•</span>
                    <p className="text-gray-100 font-medium text-base">
                        {release_date ? release_date.split("-")[0] : "N/A"}
                    </p>
                </div>
            </div>
        </motion.div>
    );
};

export default MovieCard;
