
import React, { useState } from 'react';
import ManifestoPanel from './learning-methods/ManifestoPanel';
import MethodologyGrid, { seedMethods } from './learning-methods/MethodologyGrid';
import DiagnosticsSidebar from './learning-methods/DiagnosticsSidebar';

const LearningMethodsView: React.FC = () => {
    const [selectedIds, setSelectedIds] = useState<string[]>(
        seedMethods.filter(m => m.isDefaultSelected).map(m => m.id)
    );
    const [customFrameworkText, setCustomFrameworkText] = useState('');

    const handleToggle = (id: string) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
        );
    };

    return (
        <div className="flex-1 flex h-full overflow-hidden dark:bg-black bg-neutral-100 dark:text-gray-300 text-neutral-800">
            {/* Main: 8 cols */}
            <div className="flex-1 overflow-y-auto p-6 lg:p-8 pt-24 space-y-8">
                <div>
                    <h1 className="text-2xl font-bold dark:text-white text-black font-serif mb-1">Learning Methods</h1>
                    <p className="text-sm dark:text-gray-500 text-neutral-500">
                        Configure pedagogical methodologies that shape how courses are generated and knowledge is internalized.
                    </p>
                </div>
                <ManifestoPanel />
                <MethodologyGrid selectedIds={selectedIds} onToggle={handleToggle} />
            </div>

            {/* Sidebar: 4 cols */}
            <aside className="w-96 border-l dark:border-gray-800 border-neutral-200 p-6 pt-24 overflow-y-auto hidden lg:block shrink-0 dark:bg-black bg-neutral-50">
                <DiagnosticsSidebar
                    methods={seedMethods}
                    selectedIds={selectedIds}
                    customFrameworkText={customFrameworkText}
                    onSaveFramework={setCustomFrameworkText}
                />
            </aside>
        </div>
    );
};

export default LearningMethodsView;
