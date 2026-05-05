const TreeNode = ({ node, setSelectedTeam }) => {
    return (
        <>
            <div className="team_tree_blk mt-3">
                <span className="tree_point" />
                <span className="tree_box">
                    <span className="tree_box_list">
                        <span className="tree_box_title d-block">{node?.name || '-'}</span>
                        <p className="tree_box_detail mb-0">
                            Manager: <span className="ms-1">{node?.managerName || '-'}</span>
                        </p>
                        <button
                            className="primary-text-btn fs-14 fw-medium mt-2"
                            type="button"
                            data-bs-toggle="offcanvas"
                            data-bs-target="#viewMember"
                            aria-controls="viewMember"
                            onClick={() => setSelectedTeam(node.name || '-')}
                        >
                            View Members
                        </button>
                    </span>
                </span>
            </div>

            {/* Render Children if any */}
            {node.children && node.children.length > 0 && (
                <div className="ms-4"> {/* indent for children */}
                    {node.children.map((childNode, index) => (
                        <TreeNode key={index} node={childNode} />
                    ))}
                </div>
            )}
        </>
    );
};

export default TreeNode;