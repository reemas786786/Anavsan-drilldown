import React, { useState, useRef, useEffect } from 'react';
import { AssignedQuery, User, AssignmentStatus, AssignmentPriority, CollaborationEntry } from '../types';
import { IconChevronLeft, IconChevronRight, IconClipboardCopy, IconCheck, IconAIAgent, IconUser, IconClock, IconRefresh, IconArrowUp, IconExclamationTriangle, IconChevronDown } from '../constants';

interface AssignedQueryDetailViewProps {
    assignment: AssignedQuery;
    onBack: () => void;
    currentUser: User | null;
    onUpdateStatus: (id: string, status: AssignmentStatus, comment?: string) => void;
    onAddComment: (id: string, comment: string) => void;
    onResolve: (id: string) => void;
    onReassign: (queryId: string) => void;
}

const PriorityBadge: React.FC<{ priority: AssignmentPriority }> = ({ priority }) => {
    const colorClasses = {
        Low: 'bg-status-info-light text-status-info-dark',
        Medium: 'bg-status-warning-light text-status-warning-dark',
        High: 'bg-status-error-light text-status-error-dark',
    };
    return <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full uppercase tracking-tight ${colorClasses[priority]}`}>{priority} Priority</span>;
};

const StatusBadge: React.FC<{ status: AssignmentStatus }> = ({ status }) => {
    const colorClasses: Record<AssignmentStatus, string> = {
        'Assigned': 'bg-blue-100 text-blue-700 border-blue-200',
        'In progress': 'bg-yellow-100 text-yellow-700 border-yellow-200',
        'Optimized': 'bg-status-success-light text-status-success-dark border-status-success/20',
        'Cannot be optimized': 'bg-status-error-light text-status-error-dark border-status-error/20',
        'Needs clarification': 'bg-purple-100 text-purple-700 border-purple-200',
    };
     return <span className={`inline-flex items-center px-3 py-1 text-[10px] font-black rounded-full border uppercase tracking-tight ${colorClasses[status]}`}>{status}</span>;
};

const UserAvatar: React.FC<{ name: string; size?: 'sm' | 'md' }> = ({ name, size = 'sm' }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    const sizeClasses = size === 'sm' ? 'w-6 h-6 text-[10px]' : 'w-10 h-10 text-xs';
    return (
        <div className={`${sizeClasses} rounded-full bg-primary/20 text-primary font-bold flex items-center justify-center flex-shrink-0 shadow-inner border border-white/50`}>
            {initials}
        </div>
    );
};

const AssignedQueryDetailView: React.FC<AssignedQueryDetailViewProps> = ({ assignment, onBack, currentUser, onUpdateStatus, onAddComment, onResolve, onReassign }) => {
    const [isCopied, setIsCopied] = useState(false);
    const [commentInput, setCommentInput] = useState('');
    const [isCodeVisible, setIsCodeVisible] = useState(false);
    const feedEndRef = useRef<HTMLDivElement>(null);
    
    const isFinOps = currentUser?.role === 'FinOps' || currentUser?.role === 'Admin';
    const isEngineer = currentUser?.role === 'DataEngineer';

    useEffect(() => {
        feedEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [assignment.history]);

    const handleCopy = () => {
        navigator.clipboard.writeText(assignment.queryText);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
    };

    const handleSendComment = () => {
        if (!commentInput.trim()) return;
        onAddComment(assignment.id, commentInput);
        setCommentInput('');
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendComment();
        }
    };

    return (
        <div className="flex flex-col h-full bg-background">
            {/* Action Bar / Header */}
            <header className="flex-shrink-0 bg-white border-b border-border-light px-6 py-4 flex items-center justify-between sticky top-0 z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-surface-hover rounded-full transition-colors">
                        <IconChevronLeft className="h-6 w-6 text-text-secondary" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3">
                             <h1 className="text-lg font-black text-text-primary">TASK-{assignment.queryId.substring(7, 13).toUpperCase()}</h1>
                             <StatusBadge status={assignment.status} />
                             <PriorityBadge priority={assignment.priority} />
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    {isEngineer && (assignment.status === 'Assigned' || assignment.status === 'Needs clarification') && (
                        <button 
                            onClick={() => onUpdateStatus(assignment.id, 'In progress')}
                            className="bg-primary text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-primary-hover shadow-sm transition-all flex items-center gap-2"
                        >
                            <IconRefresh className="w-4 h-4" /> Start Optimization
                        </button>
                    )}
                    {isEngineer && assignment.status === 'In progress' && (
                        <div className="flex items-center gap-2">
                             <button 
                                onClick={() => onUpdateStatus(assignment.id, 'Optimized')}
                                className="bg-status-success text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-status-success-dark shadow-sm transition-all"
                            >
                                Mark Optimized
                            </button>
                            <button 
                                onClick={() => onUpdateStatus(assignment.id, 'Needs clarification')}
                                className="bg-purple-100 text-purple-700 border border-purple-200 font-bold text-sm px-5 py-2 rounded-full hover:bg-purple-200 transition-all"
                            >
                                Request Clarification
                            </button>
                            <button 
                                onClick={() => onUpdateStatus(assignment.id, 'Cannot be optimized')}
                                className="bg-white text-text-secondary border border-border-color font-bold text-sm px-5 py-2 rounded-full hover:bg-surface-hover transition-all"
                            >
                                Cannot Optimize
                            </button>
                        </div>
                    )}
                    {isFinOps && assignment.status === 'Optimized' && (
                        <button 
                            onClick={() => onResolve(assignment.id)}
                            className="bg-status-success text-white font-bold text-sm px-5 py-2 rounded-full hover:bg-status-success-dark shadow-sm transition-all flex items-center gap-2"
                        >
                            <IconCheck className="w-4 h-4" /> Resolve Task
                        </button>
                    )}
                    {isFinOps && (
                        <button 
                            onClick={() => onReassign(assignment.queryId)}
                            className="bg-white text-text-primary border border-border-color font-bold text-sm px-5 py-2 rounded-full hover:bg-surface-hover transition-all"
                        >
                            Reassign
                        </button>
                    )}
                </div>
            </header>

            {/* Notification Banner for Needs Clarification */}
            {assignment.status === 'Needs clarification' && isFinOps && (
                <div className="bg-purple-50 border-b border-purple-100 px-6 py-3 flex items-center gap-3">
                    <IconExclamationTriangle className="w-5 h-5 text-purple-600" />
                    <p className="text-sm font-medium text-purple-800">
                        The engineer has requested clarification on this task. Please review their comments below and provide the requested details.
                    </p>
                </div>
            )}

            <div className="flex-1 overflow-hidden flex flex-col lg:flex-row">
                {/* Left Panel: Feed and Discussion */}
                <div className="flex-1 flex flex-col bg-white overflow-hidden relative">
                    <div className="flex-1 overflow-y-auto px-6 py-8 space-y-8 scroll-smooth no-scrollbar">
                        <div className="max-w-3xl mx-auto space-y-10 relative">
                             {/* Line connector */}
                             <div className="absolute left-3 top-4 bottom-4 w-px bg-border-light z-0"></div>

                            {assignment.history.map((entry) => {
                                const isOwnComment = entry.author === currentUser?.name;
                                if (entry.type === 'system') {
                                    return (
                                        <div key={entry.id} className="relative z-10 flex justify-center">
                                            <span className="px-4 py-1.5 bg-surface-nested rounded-full border border-border-light text-[10px] font-black text-text-muted uppercase tracking-widest shadow-sm">
                                                {entry.content}
                                            </span>
                                        </div>
                                    );
                                }
                                return (
                                    <div key={entry.id} className={`flex gap-4 relative z-10 ${isOwnComment ? 'flex-row-reverse' : ''}`}>
                                        <UserAvatar name={entry.author} />
                                        <div className={`flex flex-col max-w-[80%] ${isOwnComment ? 'items-end' : 'items-start'}`}>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs font-black text-text-strong">{entry.author}</span>
                                                <span className="text-[10px] text-text-muted">{new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            </div>
                                            <div className={`p-4 rounded-3xl text-sm leading-relaxed shadow-sm border ${
                                                isOwnComment 
                                                ? 'bg-primary text-white border-primary rounded-tr-none' 
                                                : 'bg-surface-nested text-text-primary border-border-color rounded-tl-none'
                                            }`}>
                                                {entry.content}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                            <div ref={feedEndRef} />
                        </div>
                    </div>

                    {/* Chat Input */}
                    <div className="flex-shrink-0 p-6 bg-white border-t border-border-light">
                        <div className="max-w-3xl mx-auto flex items-center gap-4 bg-surface-nested border border-border-color p-2 rounded-[32px] focus-within:ring-2 focus-within:ring-primary focus-within:border-primary transition-all">
                            <textarea 
                                value={commentInput}
                                onChange={(e) => setCommentInput(e.target.value)}
                                onKeyDown={handleKeyPress}
                                placeholder="Type a message or technical update..."
                                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-3 px-4 resize-none h-[48px] max-h-[120px] no-scrollbar"
                                rows={1}
                            />
                            <button 
                                onClick={handleSendComment}
                                disabled={!commentInput.trim()}
                                className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary-hover disabled:bg-gray-200 disabled:text-text-muted transition-all"
                            >
                                <IconArrowUp className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel: Side Details */}
                <aside className="w-full lg:w-96 flex-shrink-0 bg-background border-l border-border-light overflow-y-auto p-6 space-y-6">
                    {/* Collapsible Query Preview */}
                    <div className="bg-white rounded-3xl border border-border-light shadow-sm overflow-hidden">
                        <button 
                            onClick={() => setIsCodeVisible(!isCodeVisible)}
                            className="w-full px-5 py-4 flex items-center justify-between hover:bg-surface-nested transition-colors"
                        >
                            <h3 className="text-xs font-black text-text-strong uppercase tracking-widest">Query SQL</h3>
                            <IconChevronDown className={`w-4 h-4 text-text-muted transition-transform ${isCodeVisible ? 'rotate-180' : ''}`} />
                        </button>
                        {isCodeVisible && (
                            <div className="p-5 pt-0 border-t border-border-light">
                                <div className="flex justify-end mb-2">
                                    <button onClick={handleCopy} className="text-[10px] font-black text-primary hover:underline flex items-center gap-1">
                                        {isCopied ? <IconCheck className="w-3 h-3" /> : <IconClipboardCopy className="w-3 h-3" />}
                                        {isCopied ? 'COPIED' : 'COPY'}
                                    </button>
                                </div>
                                <div className="bg-[#0D1117] p-4 rounded-xl overflow-x-auto max-h-[250px]">
                                    <pre className="text-[11px] font-mono text-gray-300 leading-relaxed">
                                        <code>{assignment.queryText}</code>
                                    </pre>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Metadata Card */}
                    <div className="bg-white p-6 rounded-3xl border border-border-light shadow-sm space-y-6">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-widest border-b border-border-light pb-4">Task Details</h3>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary"><IconAIAgent className="w-4 h-4"/></div>
                                <div><p className="text-[9px] font-bold text-text-muted uppercase">Assigner</p><p className="text-xs font-black text-text-primary">{assignment.assignedBy}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-nested border border-border-color flex items-center justify-center text-text-secondary"><IconUser className="w-4 h-4"/></div>
                                <div><p className="text-[9px] font-bold text-text-muted uppercase">Assignee</p><p className="text-xs font-black text-text-primary">{assignment.assignedTo}</p></div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-surface-nested border border-border-color flex items-center justify-center text-text-secondary"><IconClock className="w-4 h-4"/></div>
                                <div><p className="text-[9px] font-bold text-text-muted uppercase">Warehouse</p><p className="text-xs font-black text-text-primary">{assignment.warehouse}</p></div>
                            </div>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="bg-primary/5 border border-primary/10 p-5 rounded-3xl">
                        <div className="flex items-center gap-2 text-primary mb-2">
                            <IconExclamationTriangle className="w-4 h-4" />
                            <h4 className="text-xs font-black uppercase tracking-wider">Workflow Help</h4>
                        </div>
                        <p className="text-xs text-text-secondary leading-relaxed">
                            {assignment.status === 'Needs clarification' 
                                ? "This task requires more information. Analysts should respond with the requested context to unblock the engineer." 
                                : "Mark as Optimized when you've successfully refactored the SQL and validated results. Provide a summary of improvements in the discussion."
                            }
                        </p>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default AssignedQueryDetailView;