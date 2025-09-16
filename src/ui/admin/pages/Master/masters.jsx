import { Package, Plus, User, X } from "lucide-react";
import { use, useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
    createMasterClass,
    createMasterStatus,
    createMasterType,
    getMasterClass,
    getMasterStatus,
    getMasterType,
} from "../../../../services/master/masterservices";

const Modal = ({ show, onClose, title, children }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-[#171821] p-6 rounded-xl w-full max-w-md">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-semibold text-white">{title}</h2>
                    <button onClick={onClose} className="text-slate-400 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const Master = () => {
    const [loading, setLoading] = useState(true);
    const [classList, setClassList] = useState([]);
    const [statusList, setStatusList] = useState([]);
    const [typeList, setTypeList] = useState([]);
    const PAGE_SIZE = 6;
    const [classPage, setClassPage] = useState(1);
    const [typePage, setTypePage] = useState(1);
    const [statusPage, setStatusPage] = useState(1);
    const [isCreatingClass, setIsCreatingClass] = useState(false);
    const [isCreatingStatus, setIsCreatingStatus] = useState(false);
    const [isCreatingType, setIsCreatingType] = useState(false);
    const [showClassModal, setShowClassModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showTypeModal, setShowTypeModal] = useState(false);
    const [classErrors, setClassErrors] = useState({});
    const [statusErrors, setStatusErrors] = useState({});
    const [typeErrors, setTypeErrors] = useState({});
    const [isAdmin, setIsAdmin] = useState(false);
    const [addFormClass, setAddFormClass] = useState({
        className: ""
    });
    const [addFormStatus, setAddFormStatus] = useState({
        statusName: ""
    });
    const [addFormType, setAddFormType] = useState({
        resourceClassName: "",
        resourceTypeName: "",
    });



    useEffect(() => {
        const name = localStorage.getItem("username") || "User";
        console.log("Logged In Username:", name);

        if (name === "admin") {
            setIsAdmin(true);
        }
    }, []);

    const validateClassForm = (data) => {
        const errors = {};
        const className = data.className.trim(); // remove spaces before/after
        if (!className) errors.className = "Class name is required";
        return errors;
    };

    const validateStatusForm = (data) => {
        const errors = {};
        const statusName = data.statusName.trim();
        if (!statusName) errors.statusName = "Status name is required";
        return errors;
    };

    const validateTypeForm = (data) => {
        const errors = {};
        const resourceClassName = data.resourceClassName.trim();
        const resourceTypeName = data.resourceTypeName.trim();

        if (!resourceClassName) errors.resourceClassName = "Resource class is required";
        if (!resourceTypeName) errors.resourceTypeName = "Resource type is required";

        return errors;
    };

    function handleClassChange(e) {
        const { name, value } = e.target;
        setAddFormClass(prev => ({ ...prev, [name]: value }));
    }

    function handleStatusChange(e) {
        const { name, value } = e.target;
        setAddFormStatus(prev => ({ ...prev, [name]: value }));
    }

    function handleTypeChange(e) {
        const { name, value } = e.target;
        setAddFormType(prev => ({ ...prev, [name]: value }));
    }

    useEffect(() => {
        fetchAll();
    }, []);

    useEffect(() => {
        if (!showClassModal) {
            setAddFormClass({ className: "" });
        }
    }, [showClassModal]);

    useEffect(() => {
        if (!showTypeModal) {
            setAddFormType({ resourceClassName: "", resourceTypeName: "" });
        }
    }, [showTypeModal]);

    useEffect(() => {
        if (!showStatusModal) {
            setAddFormStatus({ statusName: "" });
        }
    }, [showStatusModal]);

    const fetchAll = async () => {
        console.log("fetchAll started...");
        try {
            setLoading(true);
            const [classRes, statusRes, typeRes] = await Promise.all([
                getMasterClass(),
                getMasterStatus(),
                getMasterType(),
            ]);

            console.log("Master Class", classRes);
            console.log("Master Type", typeRes);
            console.log("Master Status", statusRes);

            if (classRes.success) setClassList(classRes.data || []);
            if (statusRes.success) setStatusList(statusRes.data || []);
            if (typeRes.success) setTypeList(typeRes.data || []);
        } catch (err) {
            console.error("Error in fetchAll:", err);
            toast.error("Failed to fetch master data");
        } finally {
            setLoading(false);
        }
    };

    const handleAddClass = async (e) => {
        e.preventDefault();

        // Trim before validation
        const trimmedData = { className: addFormClass.className.trim() };
        const errors = validateClassForm(trimmedData);
        if (Object.keys(errors).length > 0) {
            setClassErrors(errors);
            toast.error("Please fix errors before submitting");
            return;
        }

        setClassErrors({});
        setIsCreatingClass(true);
        try {
            const res = await createMasterClass(trimmedData); // send trimmed data
            if (res.success) {
                toast.success("Master Class created");
                setAddFormClass({ className: "" });
                setShowClassModal(false);
                fetchAll();
            } else toast.error(res.message || "Failed to create Master Class");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create Master Class");
        } finally {
            setIsCreatingClass(false);
        }
    };

    const handleAddStatus = async (e) => {
        e.preventDefault();
        const trimmedData = { statusName: addFormStatus.statusName.trim() };
        const errors = validateStatusForm(trimmedData);
        if (Object.keys(errors).length > 0) {
            setStatusErrors(errors);
            toast.error("Please fix errors before submitting");
            return;
        }

        setStatusErrors({});
        setIsCreatingStatus(true);
        try {
            const res = await createMasterStatus(trimmedData);
            if (res.success) {
                toast.success("Master Status created");
                setAddFormStatus({ statusName: "" });
                setShowStatusModal(false);
                fetchAll();
            } else toast.error(res.message || "Failed to create Master Status");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create Master Status");
        } finally {
            setIsCreatingStatus(false);
        }
    };

    const handleAddType = async (e) => {
        e.preventDefault();
        const trimmedData = {
            resourceClassName: addFormType.resourceClassName.trim(),
            resourceTypeName: addFormType.resourceTypeName.trim()
        };
        const errors = validateTypeForm(trimmedData);
        if (Object.keys(errors).length > 0) {
            setTypeErrors(errors);
            toast.error("Please fix errors before submitting");
            return;
        }

        setTypeErrors({});
        setIsCreatingType(true);
        try {
            const res = await createMasterType(trimmedData);
            if (res.success) {
                toast.success("Master Type created");
                setAddFormType({ resourceClassName: "", resourceTypeName: "" });
                setShowTypeModal(false);
                fetchAll();
            } else toast.error(res.message || "Failed to create Master Type");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create Master Type");
        } finally {
            setIsCreatingType(false);
        }
    };



    if (loading) {
        return (
            <div className="p-6 flex items-center justify-center h-64">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500 mx-auto"></div>
                    <p className="mt-4 text-slate-400">Loading...</p>
                </div>
            </div>
        );
    }

    const paginate = (list, page) => {
        const start = (page - 1) * PAGE_SIZE;
        return list.slice(start, start + PAGE_SIZE);
    };

    const paginatedClassList = paginate(classList, classPage);
    const paginatedTypeList = paginate(typeList, typePage);
    const paginatedStatusList = paginate(statusList, statusPage);

    const maxRows = PAGE_SIZE;

    const totalClassPages = Math.ceil(classList.length / PAGE_SIZE) || 1;
    const totalTypePages = Math.ceil(typeList.length / PAGE_SIZE) || 1;
    const totalStatusPages = Math.ceil(statusList.length / PAGE_SIZE) || 1;

    return (
        <div className="p-6">
            <div className="mb-6 p-6 rounded-2xl border border-[#21222d] shadow-lg bg-[#171821]">
                <div className="flex flex-wrap gap-3 items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-100 flex items-center gap-3">
                            <Package className="w-8 h-8 text-cyan-400" /> Master Resource
                        </h1>
                        <p className="text-slate-400 mt-2">
                            Manage your Master Class, Type, and Status
                        </p>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && (
                            <>
                                <button
                                    onClick={() => setShowClassModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 rounded-xl hover:scale-105 transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Class
                                </button>
                                <button
                                    onClick={() => setShowTypeModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 rounded-xl hover:scale-105 transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Type
                                </button>
                                <button
                                    onClick={() => setShowStatusModal(true)}
                                    className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-cyan-600 px-4 py-2 rounded-xl hover:scale-105 transition"
                                >
                                    <Plus className="w-4 h-4" /> Add Status
                                </button>
                            </>)}
                    </div>
                </div>
            </div>

            <Modal
                show={showClassModal}
                onClose={() => setShowClassModal(false)}
                title="Add New Class"
            >
                <p className="text-slate-400">
                    Fill in the details below to add a new resource class
                </p>
                <form onSubmit={handleAddClass} className="space-y-6 text-lg my-4">
                    <input
                        type="text"
                        name="className"
                        value={addFormClass.className}
                        onChange={handleClassChange}
                        placeholder="Class Name"
                        className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                    />
                    {classErrors.className && (
                        <p className="text-red-500 text-sm">{classErrors.className}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowClassModal(false)}
                            className="px-6 py-3 bg-slate-600 rounded-lg text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingClass}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white"
                        >
                            {isCreatingClass ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                show={showStatusModal}
                onClose={() => setShowStatusModal(false)}
                title="Add New Status"
            >
                <p className="text-slate-400">
                    Fill in the details below to add a new resource status
                </p>
                <form onSubmit={handleAddStatus} className="space-y-6 text-lg my-4">
                    <input
                        type="text"
                        name="statusName"
                        value={addFormStatus.statusName}
                        onChange={handleStatusChange}
                        placeholder="Status Name"
                        className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                    />
                    {statusErrors.statusName && (
                        <p className="text-red-500 text-sm">{statusErrors.statusName}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowStatusModal(false)}
                            className="px-6 py-3 bg-slate-600 rounded-lg text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingStatus}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white"
                        >
                            {isCreatingStatus ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            <Modal
                show={showTypeModal}
                onClose={() => setShowTypeModal(false)}
                title="Add New Type"
            >
                <p className="text-slate-400">
                    Fill in the details below to add a new resource type
                </p>
                <form onSubmit={handleAddType} className="space-y-6 text-lg my-4">
                    <select
                        name="resourceClassName"
                        value={addFormType.resourceClassName}
                        onChange={handleTypeChange}
                        className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                    >
                        <option value="">Select Resource Class</option>
                        {classList.map((cls) => (
                            <option key={cls._id} value={cls.resourceClassName}>
                                {cls.resourceClassName}
                            </option>
                        ))}
                    </select>
                    {typeErrors.resourceClassName && (
                        <p className="text-red-500 text-sm">{typeErrors.resourceClassName}</p>
                    )}

                    <input
                        type="text"
                        name="resourceTypeName"
                        value={addFormType.resourceTypeName}
                        onChange={handleTypeChange}
                        placeholder="Resource Type Name"
                        className="w-full px-4 py-3 bg-[#21222d] text-white rounded-lg border border-[#2a2b36]"
                    />
                    {typeErrors.resourceTypeName && (
                        <p className="text-red-500 text-sm">{typeErrors.resourceTypeName}</p>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={() => setShowTypeModal(false)}
                            className="px-6 py-3 bg-slate-600 rounded-lg text-white"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isCreatingType}
                            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-cyan-600 rounded-lg text-white"
                        >
                            {isCreatingType ? "Creating..." : "Create"}
                        </button>
                    </div>
                </form>
            </Modal>

            <div
                className="rounded-2xl border border-[#21222d] shadow-lg overflow-hidden"
                style={{ background: "#171821" }}
            >
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-[#21222d]">
                        <thead style={{ background: "#21222d" }}>
                            <tr>
                                <th className="border border-[#21222d] border-r-[#2a2b36] px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Resource Class
                                </th>
                                <th className="border border-[#21222d] border-r-[#2a2b36] px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Resource Type
                                </th>
                                <th className="border border-[#21222d] px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">
                                    Resource Status
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-[#21222d]">
                            {Array.from({ length: maxRows }).map((_, index) => (
                                <tr
                                    key={index}
                                    className="hover:bg-[#21222d] transition-colors duration-300"
                                >
                                    <td className="border border-[#21222d] border-r-[#2a2b36] px-6 py-4 whitespace-pre-wrap text-slate-100">
                                        {paginatedClassList[index]?.resourceClassName || ""}
                                    </td>
                                    <td className="border border-[#21222d] border-r-[#2a2b36] px-6 py-4 whitespace-pre-wrap text-slate-100">
                                        {paginatedTypeList[index]?.resourceTypeName || ""}
                                    </td>
                                    <td className="border border-[#21222d] px-6 py-4 whitespace-pre-wrap text-slate-100">
                                        {paginatedStatusList[index]?.resourceStatusName || ""}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="flex justify-between px-6 py-3 space-x-6 border-t border-[#21222d] bg-[#171821]">
                    <div>
                        <div className="text-sm text-slate-400 mb-1">Class Page</div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={classPage === 1}
                                onClick={() => setClassPage(classPage - 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-slate-300">{classPage} / {totalClassPages}</span>
                            <button
                                disabled={classPage === totalClassPages}
                                onClick={() => setClassPage(classPage + 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-slate-400 mb-1">Type Page</div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={typePage === 1}
                                onClick={() => setTypePage(typePage - 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-slate-300">{typePage} / {totalTypePages}</span>
                            <button
                                disabled={typePage === totalTypePages}
                                onClick={() => setTypePage(typePage + 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>

                    <div>
                        <div className="text-sm text-slate-400 mb-1">Status Page</div>
                        <div className="flex items-center space-x-2">
                            <button
                                disabled={statusPage === 1}
                                onClick={() => setStatusPage(statusPage - 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            <span className="text-slate-300">{statusPage} / {totalStatusPages}</span>
                            <button
                                disabled={statusPage === totalStatusPages}
                                onClick={() => setStatusPage(statusPage + 1)}
                                className="px-3 py-1 rounded bg-[#21222d] text-slate-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Master;

