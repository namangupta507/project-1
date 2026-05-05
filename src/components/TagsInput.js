import React, { useState } from 'react';

const TagsInput = ({ tags, tagInput, setTags, setTagInput }) => {
    const addTag = (tag) => {
        const trimmedTag = tag.trim();
        if (trimmedTag && !tags.includes(trimmedTag)) {
            setTags([...tags, trimmedTag]);
        }
    };

    const removeTag = (indexToRemove) => {
        setTags(tags.filter((_, index) => index !== indexToRemove));
    };

    const handleKeyDown = (e) => {
        if (['Enter', ' ', ','].includes(e.key)) {
            e.preventDefault();
            if (tagInput.trim() !== '') {
                addTag(tagInput);
                setTagInput('');
            }
        } else if (e.key === 'Backspace' && tagInput === '' && tags.length > 0) {
            // Remove last tag if input is empty and backspace is pressed
            removeTag(tags.length - 1);
        }
    };

    return (
        <div className="ofcvs_form_item">
            <span
                className="ofcvs_field_icon"
                style={{ background: 'url(/assets/images/tags-icon.svg)' }}
            />
            <div className="ofcvs_form_field">
                <div className="tags-input-container">
                    {tags?.length > 0 && tags?.map((tag, index) => (
                        <div className="tag-chip" key={index}>
                            {tag}
                            <button
                                onClick={() => removeTag(index)}
                                className="remove-tag"
                                aria-label={`Remove tag ${tag}`}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                    <input
                        type="text"
                        placeholder="Tags"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="tags-input"
                    />
                </div>
            </div>
        </div>
    );
};

export default TagsInput;
