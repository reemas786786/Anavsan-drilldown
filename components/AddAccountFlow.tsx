
import React, { useState } from 'react';
import { IconClose, IconClipboardCopy, IconCheck, IconPhoto, IconFileText, IconHelpCircle, IconAdd, IconChevronDown, IconSparkles } from '../constants';

interface AddAccountFlowProps {
    onCancel: () => void;
    onAddAccount: (data: { name: string }) => void;
}

const CodeBlock: React.FC<{ code: string }> = ({ code }) => {
    const [copied, setCopied] = useState(false);
    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group bg-surface-nested border border-border-color rounded-lg p-4 mt-2">
            <button 
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md bg-white border border-border-color text-text-muted hover:text-primary transition-colors shadow-sm"
                title="Copy code"
            >
                {copied ? <IconCheck className="w-3.5 h-3.5 text-status-success" /> : <IconClipboardCopy className="w-3.5 h-3.5" />}
            </button>
            <pre className="text-[11px] font-mono text-text-primary leading-relaxed overflow-x-auto whitespace-pre">
                <code>{code}</code>
            </pre>
        </div>
    );
};

const QuickGuideContent: React.FC<{ onClose?: () => void }> = ({ onClose }) => (
    <div className="space-y-8">
        <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-strong font-bold text-sm">
                <IconFileText className="w-4 h-4" />
                <h4>Snowflake User Setup</h4>
            </div>
            <ul className="list-disc pl-5 text-xs text-text-secondary space-y-2 leading-relaxed">
                <li>Perform the following tasks to set up a Snowflake user for use with Anavsan.</li>
                <li>For detailed steps, refer to the <a href="#" className="text-link hover:underline">documentation</a>.</li>
            </ul>
        </section>

        <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-strong font-bold text-sm">
                <IconPhoto className="w-4 h-4" />
                <h4>Create a Snowflake User</h4>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed">If no user exists for this integration, create one using:</p>
            <CodeBlock code={`CREATE USER anavsan_user
PASSWORD = '<StrongPassword>'
DEFAULT_ROLE = '<your_role>'
DEFAULT_WAREHOUSE = '<your_warehouse>'
MUST_CHANGE_PASSWORD = FALSE;`} />
        </section>

        <section className="space-y-3">
            <div className="flex items-center gap-2 text-text-strong font-bold text-sm">
                <IconHelpCircle className="w-4 h-4" />
                <h4>Technical Documentation</h4>
            </div>
            <ul className="space-y-2">
                <li><a href="#" className="text-xs text-link font-medium hover:underline">Connecting to Snowflake</a></li>
                <li><a href="#" className="text-xs text-link font-medium hover:underline">Required Snowflake Permissions</a></li>
            </ul>
        </section>
    </div>
);

const AddAccountFlow: React.FC<AddAccountFlowProps> = ({ onCancel, onAddAccount }) => {
    const [step, setStep] = useState(1);
    const [isGuideOpen, setIsGuideOpen] = useState(true);
    const [formData, setFormData] = useState({
        name: 'Marketing Team Snowflake',
        identifier: 'xy12345.east-us-2.azure',
        username: 'anavsan_user',
        password: 'StrongPassword123',
        authMethod: 'password',
        role: 'SYSADMIN',
        warehouse: 'ANALYTICS_WH'
    });

    const handleNext = () => setStep(2);
    const handleBack = () => setStep(1);

    const handleAdd = () => {
        onAddAccount({ name: formData.name });
    };

    return (
        <div className="flex h-full bg-white relative">
            {/* Main Content Area */}
            <div className="flex-grow flex flex-col min-w-0">
                {/* Fixed Header */}
                <div className="px-8 pt-8 pb-4 bg-white flex-shrink-0">
                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold text-text-strong">Connect your Snowflake account</h1>
                            <p className="text-sm text-text-secondary mt-1">Provide your account details to connect Anavsan with Snowflake and begin optimizing your data.</p>
                        </div>
                        {!isGuideOpen && (
                            <button 
                                onClick={() => setIsGuideOpen(true)}
                                className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold text-primary bg-primary/10 rounded-lg hover:bg-primary/20 transition-colors"
                            >
                                <IconHelpCircle className="w-4 h-4" />
                                Show Guide
                            </button>
                        )}
                    </div>
                    
                    {/* Stepped Progress */}
                    <div className="mt-8 flex items-center gap-12 border-b border-border-light relative overflow-x-auto no-scrollbar">
                        <div className={`pb-4 flex items-center gap-2 border-b-2 transition-colors relative z-10 flex-shrink-0 ${step === 1 ? 'border-primary' : 'border-transparent opacity-60'}`}>
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${step === 1 ? 'bg-primary text-white' : 'bg-status-success text-white'}`}>
                                {step > 1 ? <IconCheck className="w-3 h-3" /> : '1'}
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-text-strong uppercase tracking-wider">Account details</p>
                                <p className="text-[10px] text-text-muted font-medium">Validate information for mapping and optimization.</p>
                            </div>
                        </div>
                        <div className={`pb-4 flex items-center gap-2 border-b-2 transition-colors relative z-10 flex-shrink-0 ${step === 2 ? 'border-primary' : 'border-transparent opacity-60'}`}>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${step === 2 ? 'bg-primary border-primary text-white' : 'border-border-color text-text-muted'}`}>
                                2
                            </div>
                            <div className="text-left">
                                <p className="text-xs font-bold text-text-strong uppercase tracking-wider">Connection setup</p>
                                <p className="text-[10px] text-text-muted font-medium">Securely connect to your data platform.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form and Collapsible Guide Scroll Area */}
                <div className="flex-grow overflow-y-auto bg-[#F8F9FB]">
                    <div className="max-w-4xl mx-auto px-8 py-8 space-y-8">
                        
                        {/* Collapsible Guide (Alert-style for tablet/mobile, hidden on desktop if sidebar is used) */}
                        {isGuideOpen && (
                            <div className="lg:hidden bg-white border border-border-light rounded-2xl shadow-sm overflow-hidden animate-in fade-in slide-in-from-top-4 duration-300">
                                <div className="px-6 py-4 bg-background border-b border-border-light flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-text-strong">Quick Guide</h3>
                                    <button 
                                        onClick={() => setIsGuideOpen(false)}
                                        className="text-text-muted hover:text-text-primary p-1 hover:bg-surface-nested rounded"
                                    >
                                        <IconClose className="w-5 h-5" />
                                    </button>
                                </div>
                                <div className="p-6">
                                    <QuickGuideContent />
                                </div>
                            </div>
                        )}

                        {/* Actual Form Fields */}
                        <div className="max-w-xl space-y-6">
                            {step === 1 ? (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Friendly account name</label>
                                        <input 
                                            type="text" 
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            className="w-full bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                            placeholder="Enter name (e.g., Marketing Team Snowflake)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Account identifier</label>
                                        <input 
                                            type="text" 
                                            value={formData.identifier}
                                            onChange={(e) => setFormData({...formData, identifier: e.target.value})}
                                            className="w-full bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                            placeholder="Enter Identifier (e.g., xy12345.east-us-2.azure)"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Username</label>
                                        <input 
                                            type="text" 
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value})}
                                            className="w-full bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                            placeholder="Your snowflake username"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-3 ml-1">Authentication method:</label>
                                        <div className="flex gap-6">
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="auth" 
                                                    checked={formData.authMethod === 'password'} 
                                                    onChange={() => setFormData({...formData, authMethod: 'password'})}
                                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Password</span>
                                            </label>
                                            <label className="flex items-center gap-2 cursor-pointer group">
                                                <input 
                                                    type="radio" 
                                                    name="auth" 
                                                    checked={formData.authMethod === 'keypair'} 
                                                    onChange={() => setFormData({...formData, authMethod: 'keypair'})}
                                                    className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                                />
                                                <span className="text-sm font-medium text-text-primary group-hover:text-primary transition-colors">Key Pair</span>
                                            </label>
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Password</label>
                                        <div className="relative">
                                            <input 
                                                type="password" 
                                                value={formData.password}
                                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                                className="w-full bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                                placeholder="Enter password"
                                            />
                                        </div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Role</label>
                                        <div className="relative">
                                            <select 
                                                value={formData.role}
                                                onChange={(e) => setFormData({...formData, role: e.target.value})}
                                                className="w-full appearance-none bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                            >
                                                <option value="SYSADMIN">SYSADMIN</option>
                                                <option value="ACCOUNTADMIN">ACCOUNTADMIN</option>
                                                <option value="PUBLIC">PUBLIC</option>
                                            </select>
                                            <IconChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
                                        </div>
                                        <p className="text-[10px] text-text-muted mt-2 ml-1">Leave blank to use Snowflake's default role.</p>
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold text-text-muted uppercase tracking-widest mb-2 ml-1">Warehouse</label>
                                        <input 
                                            type="text" 
                                            value={formData.warehouse}
                                            onChange={(e) => setFormData({...formData, warehouse: e.target.value})}
                                            className="w-full bg-white border border-border-color rounded-2xl px-5 py-3.5 text-sm focus:ring-2 focus:ring-primary focus:border-transparent outline-none shadow-sm transition-all"
                                            placeholder="Enter warehouse name"
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 bg-white flex items-center justify-between flex-shrink-0 border-t border-border-light">
                    <div className="flex items-center gap-4">
                        {step === 1 ? (
                            <>
                                <button 
                                    onClick={onCancel} 
                                    className="px-8 py-2.5 rounded-xl bg-gray-100 text-text-primary font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-sm"
                                >
                                    Cancel
                                </button>
                                <button 
                                    onClick={handleNext} 
                                    className="px-10 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20"
                                >
                                    Next
                                </button>
                            </>
                        ) : (
                            <>
                                <button 
                                    onClick={handleBack} 
                                    className="px-8 py-2.5 rounded-xl bg-gray-100 text-text-primary font-bold text-sm hover:bg-gray-200 active:scale-95 transition-all shadow-sm"
                                >
                                    Back
                                </button>
                                <button 
                                    onClick={handleAdd} 
                                    className="px-8 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary-hover active:scale-95 transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                                >
                                    <span>Connect account</span>
                                    <IconAdd className="w-5 h-5" />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Quick Guide Sidebar - Only visible on LG screens */}
            {isGuideOpen && (
                <aside className="hidden lg:flex w-[340px] border-l border-border-light h-full bg-white flex-col flex-shrink-0 shadow-[-4px_0_12px_rgba(0,0,0,0.02)] z-10">
                    <div className="p-6 border-b border-border-light flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <IconSparkles className="w-5 h-5 text-primary" />
                            <h3 className="text-base font-bold text-text-strong">Quick Guide</h3>
                        </div>
                        <button 
                            onClick={() => setIsGuideOpen(false)}
                            className="text-text-muted hover:text-text-primary p-1 hover:bg-surface-nested rounded"
                        >
                            <IconClose className="w-5 h-5" />
                        </button>
                    </div>
                    <div className="flex-grow overflow-y-auto p-6 scroll-smooth">
                        <QuickGuideContent />
                    </div>
                </aside>
            )}
        </div>
    );
};

export default AddAccountFlow;
