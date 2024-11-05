import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PostDetail = () => {
    const { story_id, post_id } = useParams();
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const response = await fetch(`http://localhost:3000/board/${story_id}/post/${post_id}`);
                if (!response.ok) {
                    throw new Error("게시물을 불러오는데 실패했습니다.");
                }
                const data = await response.json();
                setPost(data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
                setLoading(false);
            }
        };
        fetchPost();
    }, [story_id, post_id]);

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>
            <h1>{post.title}</h1>
            <p style={{ color: "#888", fontSize: "14px" }}>
                작성일: {new Date(post.uploaded_time).toLocaleDateString()}
            </p>
            <div style={{ marginTop: "20px", border: "1px solid #ddd", padding: "20px", borderRadius: "5px" }}>
                <p>{post.content}</p>
            </div>
        </div>
    );
};

export default PostDetail;
