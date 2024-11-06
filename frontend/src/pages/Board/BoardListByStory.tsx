import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const BoardListByStory = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await fetch(`http://localhost:3000/stories/${id}`);
                const data = await response.json();
                setPosts(data);
            } catch (error) {
                console.error("Failed to fetch posts:", error);
            }
        };
        fetchPosts();
    }, [id]);

    const handlePostClick = (postId) => {
        navigate(`/board/${id}/post/${postId}`);
    };

    return (
        <div>
            <h1>게시물 목록 (Story ID: {id})</h1>
            {posts.length > 0 ? (
                posts.map((post) => (
                    <div key={post.geul_id} onClick={() => handlePostClick(post.geul_id)} style={{ cursor: "pointer" }}>
                        <h2>{post.title}</h2>
                        <p>{post.content}</p>
                    </div>
                ))
            ) : (
                <p>게시물이 없습니다.</p>
            )}
        </div>
    );
};

export default BoardListByStory;
