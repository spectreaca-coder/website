import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { useLocation } from 'react-router-dom';
import './DailyBriefing.css'; // We'll create this CSS file next

const DailyBriefing = () => {
    const [briefing, setBriefing] = useState({ title: "Today's Briefing", content: "Loading...", date: new Date().toLocaleDateString() });
    const [isEditing, setIsEditing] = useState(false);
    const [editContent, setEditContent] = useState("");
    const [isAdmin, setIsAdmin] = useState(false);
    const location = useLocation();

    // Check for admin mode via URL query param
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        if (searchParams.get('admin') === 'true') {
            setIsAdmin(true);
        }
    }, [location]);

    // Fetch briefing data
    useEffect(() => {
        const docRef = doc(db, "daily_updates", "latest");
        const unsubscribe = onSnapshot(docRef, (docSnap) => {
            if (docSnap.exists()) {
                setBriefing(docSnap.data());
                setEditContent(docSnap.data().content);
            } else {
                // Initialize if not exists
                const initialData = {
                    title: "Director's Note",
                    content: "Welcome to Specter. Stay tuned for daily updates.",
                    date: new Date().toLocaleDateString()
                };
                setDoc(docRef, initialData);
                setBriefing(initialData);
                setEditContent(initialData.content);
            }
        });

        return () => unsubscribe();
    }, []);

    const handleSave = async () => {
        try {
            const docRef = doc(db, "daily_updates", "latest");
            await setDoc(docRef, {
                ...briefing,
                content: editContent,
                date: new Date().toLocaleDateString()
            });
            setIsEditing(false);
            alert("Briefing updated successfully!");
        } catch (error) {
            console.error("Error updating briefing: ", error);
            alert("Failed to update briefing.");
        }
    };

    return (
        <section className="daily-briefing-section">
            <div className="daily-briefing-container">
                <div className="daily-briefing-header">
                    <h3 className="daily-briefing-title">{briefing.title}</h3>
                    <span className="daily-briefing-date">{briefing.date}</span>
                </div>

                {isEditing ? (
                    <div className="daily-briefing-editor">
                        <textarea
                            value={editContent}
                            onChange={(e) => setEditContent(e.target.value)}
                            className="daily-briefing-textarea"
                            rows={5}
                        />
                        <div className="daily-briefing-actions">
                            <button onClick={handleSave} className="daily-briefing-save-btn">Save Update</button>
                            <button onClick={() => setIsEditing(false)} className="daily-briefing-cancel-btn">Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="daily-briefing-content">
                        <p>{briefing.content}</p>
                        {isAdmin && (
                            <button
                                onClick={() => setIsEditing(true)}
                                className="daily-briefing-edit-btn"
                            >
                                Edit Briefing
                            </button>
                        )}
                    </div>
                )}
            </div>
        </section>
    );
};

export default DailyBriefing;
