import React, { useState } from 'react';
import { NavigationItem } from './types';
import classNames from 'classnames';
import Link from 'next/link';

interface NavigationMobileProps {
  items: NavigationItem[];
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  darkMode: boolean;
}

export const NavigationMobile: React.FC<NavigationMobileProps> = ({
  items,
  isOpen,
  onClose,
  currentPath,
  darkMode,
}) => {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set());

  const toggleExpanded = (index: number) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedItems(newExpanded);
  };

  if (!isOpen) return null;

  return (
    <div className="lg:hidden fixed inset-0 z-[90]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Mobile Menu */}
      <div className={classNames(
        'fixed top-[68px] left-0 right-0 bottom-0 overflow-y-auto z-[95]',
        'bg-black',
        'px-4 py-2'
      )}>
        <nav>
          {items.map((item, index) => {
            const isActive = typeof item.isActive === 'function'
              ? item.isActive(currentPath)
              : item.isActive || currentPath === item.href;
            const isExpanded = expandedItems.has(index);

            return (
              <div key={index} className="border-b border-white/10 last:border-b-0">
                {item.children ? (
                  <>
                    {/* Accordion Header */}
                    <button
                      onClick={() => toggleExpanded(index)}
                      className={classNames(
                        'w-full flex items-center justify-between py-5 text-left',
                        'text-white text-lg font-normal',
                        'transition-opacity hover:opacity-80'
                      )}
                    >
                      <span>{item.label}</span>
                      <svg
                        className={classNames(
                          'w-5 h-5 transition-transform duration-300',
                          isExpanded && 'rotate-180'
                        )}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {/* Expanded Content */}
                    {isExpanded && (
                      <div className="pb-4">
                        {/* Container with darker background like desktop dropdown */}
                        <div className="bg-white/[0.02] rounded-xl p-6 border border-white/[0.05]">
                          {item.children.map((section, sectionIndex) => (
                            <div key={sectionIndex} className={sectionIndex > 0 ? 'mt-6' : ''}>
                              {section.title && (
                                <div className="flex items-center mb-4 text-[13px] uppercase tracking-widest text-gray-400">
                                  {section.icon && <span className="mr-2">{section.icon}</span>}
                                  {section.title}
                                </div>
                              )}
                              <div className="space-y-1">
                                {section.items.map((link, linkIndex) => {
                                  const linkIsActive = typeof link.isActive === 'function'
                                    ? link.isActive(currentPath)
                                    : link.isActive || currentPath === link.href;

                                  // Reuse same item rendering logic as desktop dropdown
                                  const LinkComponent = link.isExternal ? 'a' : Link;
                                  const linkProps = link.isExternal 
                                    ? { href: link.href, target: '_blank', rel: 'noopener noreferrer' }
                                    : { href: link.href };

                                  return (
                                    <LinkComponent
                                      key={linkIndex}
                                      {...linkProps}
                                      onClick={onClose}
                                      className={classNames(
                                        'block group',
                                        link.image ? 'focus:outline-none' : 'p-3 -mx-3 rounded-lg',
                                        !link.image && 'transition-[background-color,box-shadow] duration-200',
                                        !link.image && 'hover:bg-white/5 hover:shadow-[0_0_0_1px_rgba(255,255,255,0.1)]',
                                        !link.image && 'focus:outline-none focus:bg-white/5 focus:shadow-[0_0_0_1px_rgba(255,255,255,0.2)]',
                                        {
                                          'opacity-100': link.image || linkIsActive,
                                          'opacity-90': !link.image && !linkIsActive,
                                        }
                                      )}
                                    >
                                      {link.image ? (
                                        <div className="flex flex-col">
                                          {link.image}
                                          {link.description && (
                                            <div className="text-[14px] text-gray-300 leading-relaxed mt-2">
                                              {link.description}
                                            </div>
                                          )}
                                        </div>
                                      ) : (
                                        <>
                                          <div className={classNames(
                                            'text-white text-base font-normal',
                                            link.description && 'mb-1'
                                          )}>
                                            {link.label}
                                          </div>
                                          {link.description && (
                                            <div className="text-[13px] text-gray-400 leading-relaxed transition-colors duration-200 group-hover:text-gray-300">
                                              {link.description}
                                            </div>
                                          )}
                                        </>
                                      )}
                                    </LinkComponent>
                                  );
                                })}
                              </div>
                              {sectionIndex < item.children.length - 1 && section.divider && (
                                <div className="h-px bg-white/10 mt-6" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    onClick={onClose}
                    className={classNames(
                      'block py-5 text-white text-lg font-normal',
                      'transition-opacity hover:opacity-80'
                    )}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            );
          })}
        </nav>
      </div>
    </div>
  );
};