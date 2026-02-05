
import React, { useRef, useState, useEffect } from 'react';
import { Account } from '../types';
import { accountNavItems } from '../constants';
import { IconChevronDown, IconChevronLeft, IconChevronRight, IconCheck, IconSearch, IconArrowUp } from '../constants';

const ChevronUpIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M12 10L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;
const ChevronDownIcon = ({ className }: { className?: string }) => <svg className={className} width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M4 6L8 10L12 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>;

const AccountAvatar: React.FC<{ name: string }> = ({ name }) => {
    const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    return (
        <div className="h-8 w-8 rounded-full bg-primary/20 text-primary text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {initials}
        </div>
    );
};

const ContextualNavItem: React.FC<{
    item: typeof accountNavItems[0];
    isSidebarExpanded: boolean;
    activePage: string;
    onPageChange: (page: string) => void;
    openSubMenus: Record<string, boolean>;
    handleSubMenuToggle: (itemName: string) => void;
    selectedApplicationId?: string | null;
}> = ({ item, isSidebarExpanded, activePage, onPageChange, openSubMenus, handleSubMenuToggle, selectedApplicationId }) => {
    const [openFlyout, setOpenFlyout] = useState(false);
    const flyoutTimeoutIdRef = useRef<number | null>(null);

    const handleFlyoutEnter = () => {
        if (flyoutTimeoutIdRef.current) clearTimeout(flyoutTimeoutIdRef.current);
        setOpenFlyout(true);
    };

    const handleFlyoutLeave = () => {
        flyoutTimeoutIdRef.current = window.setTimeout(() => setOpenFlyout(false), 200);
    };

    const hasChildren = item.children.length > 0;
    const isSubMenuOpen = openSubMenus[item.name];
    const isSomeChildActive = hasChildren && item.children.some(c => c.name === activePage);

    // FIX: Only treat the page as active if we are NOT on a particular application detail view
    const isItemActuallyActive = (activePage === item.name) && !(item.name === 'Applications' && selectedApplicationId);

    if (isSidebarExpanded) {
        if (!hasChildren) {
            return (
                <li>
                    <button
                        onClick={() => onPageChange(item.name)}
                        className={`w-full flex items-center gap-3 text-left p-2 rounded-lg text-sm transition-colors ${
                            isItemActuallyActive
                            ? 'bg-[#EFE9FE] text-primary font-semibold'
                            : 'text-text-strong font-medium hover:bg-surface-hover'
                        }`}
                    >
                        <item.icon className={`h-5 w-5 shrink-0`} />
                        <span>{item.name}</span>
                    </button>
                </li>
            );
        }

        return (
            <li>
                <button
                    onClick={() => handleSubMenuToggle(item.name)}
                    className={`w-full flex items-center justify-between text-left p-2 rounded-lg hover:bg-surface-hover`}
                >
                    <div className="flex items-center gap-3">
                        <item.icon className={`h-5 w-5 shrink-0 ${isSomeChildActive ? 'text-primary' : 'text-text-strong'}`} />
                        <span className={`text-sm font-bold text-text-strong`}>{item.name}</span>
                    </div>
                    {isSubMenuOpen ? <ChevronUpIcon className="h-4 w-4 text-text-secondary" /> : <ChevronDownIcon className="h-4 w-4 text-text-secondary" />}
                </button>
                {isSubMenuOpen && (
                    <ul className="pl-5 mt-1 space-y-0.5">
                        {item.children.map(child => (
                            <li key={child.name}>
                                <button
                                    onClick={() => onPageChange(child.name)}
                                    className={`w-full text-left flex items-center gap-3 py-1.5 px-3 rounded-lg text-sm transition-colors ${
                                        activePage === child.name 
                                        ? 'text-primary font-medium' 
                                        : 'text-text-secondary hover:text-text-primary'
                                    }`}
                                >
                                    <child.icon className="h-4 w-4 shrink-0" />
                                    <span>{child.name}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
            </li>
        );
    } else {
        const isActive = activePage === item.name || isSomeChildActive;
        return (
            <li
                onMouseEnter={handleFlyoutEnter}
                onMouseLeave={handleFlyoutLeave}
                className="relative"
            >
                <button
                    onClick={() => onPageChange(hasChildren ? item.children[0].name : item.name)}
                    className={`w-full group relative flex items-center justify-center p-2 rounded-lg text-sm transition-colors ${
                        isActive
                        ? 'bg-[#EFE9FE] text-primary'
                        : 'text-text-strong hover:bg-surface-hover'
                    }`}
                >
                    <item.icon className="h-5 w-5 shrink-0" />
                </button>

                {openFlyout && (
                     <div 
                        className="absolute left-full ml-2 top-0 w-60 bg-surface rounded-lg shadow-lg p-2 z-30 border border-border-color"
                        onMouseEnter={handleFlyoutEnter}
                        onMouseLeave={handleFlyoutLeave}
                    >
                        <div className="px-3 py-2 text-sm font-semibold text-text-strong">{item.name}</div>
                        {hasChildren ? (
                             <ul className="space-y-0.5">
                                {item.children.map(child => (
                                    <li key={child.name}>
                                        <button
                                            onClick={() => onPageChange(child.name)}
                                            className={`w-full text-left py-1.5 px-3 rounded-md text-sm transition-colors ${
                                                activePage === child.name 
                                                ? 'text-primary font-medium' 
                                                : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                                            }`}
                                        >
                                            <span>{child.name}</span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : null}
                    </div>
                )}
            </li>
        );
    }
};

interface ContextualSidebarProps {
    account: Account;
    accounts: Account[];
    onSwitchAccount: (account: Account) => void;
    activePage: string;
    onPageChange: (page: string) => void;
    onBackToAccounts: () => void;
    backLabel?: string;
    selectedApplicationId?: string | null;
}

const ContextualSidebar: React.FC<ContextualSidebarProps> = ({ account, accounts, onSwitchAccount, activePage, onPageChange, onBackToAccounts, backLabel = 'Back to accounts', selectedApplicationId }) => {
    const [isSidebarExpanded, setIsSidebarExpanded] = useState(true);
    const [isAccountSwitcherOpen, setIsAccountSwitcherOpen] = useState(false);
    const accountSwitcherRef = useRef<HTMLDivElement>(null);
    const [openSubMenus, setOpenSubMenus] = useState<Record<string, boolean>>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (accountSwitcherRef.current && !accountSwitcherRef.current.contains(event.target as Node)) {
                setIsAccountSwitcherOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Set default open submenu based on active page or local storage
    useEffect(() => {
        // Try to find which parent contains the active page
        let parentToOpen = accountNavItems.find(item => item.children.some(child => child.name === activePage))?.name;
        
        if (!parentToOpen) {
            const savedMenu = localStorage.getItem('anavsan_last_open_submenu');
            const defaultMenu = 'Query performance';
            const isValidSavedMenu = accountNavItems.some(item => item.name === savedMenu);
            parentToOpen = isValidSavedMenu ? savedMenu! : defaultMenu;
        }

        setOpenSubMenus(prev => ({ ...prev, [parentToOpen!]: true }));
    }, [account.id, activePage]);

    const handleSubMenuToggle = (itemName: string) => {
        setOpenSubMenus(prev => {
            const isCurrentlyOpen = !!prev[itemName];
            
            if (isCurrentlyOpen) {
                localStorage.removeItem('anavsan_last_open_submenu');
                return { ...prev, [itemName]: false };
            } else {
                localStorage.setItem('anavsan_last_open_submenu', itemName);
                return { ...prev, [itemName]: true };
            }
        });
    };

    return (
        <aside className={`bg-surface flex-shrink-0 flex flex-col transition-all duration-300 ease-in-out border-r border-border-light ${isSidebarExpanded ? 'w-64' : 'w-16'}`}>
            <div className="flex-shrink-0 border-b border-border-light">
                <button
                    onClick={onBackToAccounts}
                    className={`w-full flex items-center gap-3 p-4 text-text-secondary hover:text-primary transition-colors font-bold text-xs ${isSidebarExpanded ? '' : 'justify-center'}`}
                >
                    <IconChevronLeft className="h-4 w-4" />
                    {isSidebarExpanded && <span>{backLabel}</span>}
                </button>
            </div>
            
            <div className={`p-2 flex-shrink-0 transition-all ${isSidebarExpanded ? '' : 'flex justify-center'}`}>
                {/* Account Switcher */}
                <div 
                    ref={accountSwitcherRef}
                    className="relative w-full"
                >
                    <button
                        onClick={() => setIsAccountSwitcherOpen(prev => !prev)}
                        className={`w-full flex items-center transition-colors group relative ${
                            isSidebarExpanded 
                            ? 'text-left p-2 rounded-lg bg-background hover:bg-surface-hover border border-border-light justify-between' 
                            : 'h-10 w-10 rounded-full bg-surface-nested hover:bg-surface-hover justify-center'
                        }`}
                        aria-haspopup="true"
                        aria-expanded={isAccountSwitcherOpen}
                        title={isSidebarExpanded ? "Switch Account" : account.name}
                    >
                        {isSidebarExpanded ? (
                            <>
                                <div className="flex items-center gap-2 overflow-hidden">
                                    <AccountAvatar name={account.name} />
                                    <span className="text-sm font-bold text-text-primary truncate">{account.name}</span>
                                </div>
                                <IconChevronDown className={`h-5 w-5 text-text-secondary transition-transform ${isAccountSwitcherOpen ? 'rotate-180' : ''}`} />
                            </>
                        ) : (
                            <AccountAvatar name={account.name} />
                        )}
                    </button>
                    {isAccountSwitcherOpen && (
                        <div className={`absolute z-20 mt-2 rounded-lg bg-surface shadow-lg p-2 border border-border-color ${isSidebarExpanded ? 'w-full' : 'w-64 left-full ml-2 -top-2'}`}>
                            <ul className="max-h-60 overflow-y-auto">
                                {accounts.map(acc => {
                                    const isActive = acc.id === account.id;
                                    return (
                                        <li key={acc.id}>
                                            <button
                                                onClick={() => { onSwitchAccount(acc); setIsAccountSwitcherOpen(false); }}
                                                className={`w-full text-left flex items-center justify-between gap-2 p-2 rounded-lg text-sm font-medium transition-colors ${
                                                    isActive
                                                        ? 'bg-primary/10 text-primary font-semibold'
                                                        : 'hover:bg-surface-hover text-text-secondary hover:text-text-primary'
                                                }`}
                                            >
                                                <div className="flex items-center gap-2 overflow-hidden">
                                                    <AccountAvatar name={acc.name} />
                                                    <span className="truncate">{acc.name}</span>
                                                </div>
                                                {isActive && <IconCheck className="h-5 w-5 text-primary flex-shrink-0" />}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>
            </div>

            <nav className={`flex-grow px-2 ${isSidebarExpanded ? 'overflow-y-auto' : ''}`}>
                <ul className="space-y-1">
                    {accountNavItems.map(item => (
                        <ContextualNavItem
                            key={item.name}
                            item={item}
                            isSidebarExpanded={isSidebarExpanded}
                            activePage={activePage}
                            onPageChange={onPageChange}
                            openSubMenus={openSubMenus}
                            handleSubMenuToggle={handleSubMenuToggle}
                            selectedApplicationId={selectedApplicationId}
                        />
                     ))}
                </ul>
            </nav>

            <div className="p-2 mt-auto flex-shrink-0">
                <div className={`border-t border-border-light ${isSidebarExpanded ? 'mx-2' : ''}`}></div>
                <div className={`flex mt-2 ${isSidebarExpanded ? 'justify-end' : 'justify-center'}`}>
                    <button
                        onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}
                        className="p-2 rounded-full hover:bg-surface-hover focus:outline-none focus:ring-2 focus:ring-primary"
                        aria-label={isSidebarExpanded ? "Collapse sidebar" : "Expand sidebar"}
                    >
                        {isSidebarExpanded 
                            ? <IconChevronLeft className="h-5 w-5 text-text-secondary" /> 
                            : <IconChevronRight className="h-5 w-5 text-text-secondary" />
                        }
                    </button>
                </div>
            </div>
        </aside>
    );
};

export default ContextualSidebar;
