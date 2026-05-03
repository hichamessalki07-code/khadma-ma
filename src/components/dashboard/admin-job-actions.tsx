"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { CheckCircle, XCircle, Trash2, Loader2 } from "lucide-react";

interface AdminJobActionsProps {
  jobId: string;
  currentStatus: string;
}

export function AdminJobActions({ jobId, currentStatus }: AdminJobActionsProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  const handleAction = async (action: "approve" | "reject" | "delete") => {
    setLoading(action);
    try {
      const res = await fetch(`/api/admin/jobs/${jobId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) throw new Error();

      toast({
        title: action === "approve" ? "Offre approuvée" : action === "reject" ? "Offre rejetée" : "Offre supprimée",
        description: "L'action a été effectuée avec succès.",
      });
      router.push("/dashboard/admin/jobs");
      router.refresh();
    } catch {
      toast({ variant: "destructive", title: "Erreur", description: "Impossible d'effectuer cette action." });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="flex gap-3 flex-wrap">
      {currentStatus !== "PUBLISHED" && (
        <Button
          onClick={() => handleAction("approve")}
          disabled={!!loading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {loading === "approve" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
          Approuver et publier
        </Button>
      )}
      {currentStatus !== "REJECTED" && (
        <Button
          variant="outline"
          onClick={() => handleAction("reject")}
          disabled={!!loading}
          className="border-red-300 text-red-600 hover:bg-red-50"
        >
          {loading === "reject" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
          Rejeter
        </Button>
      )}
      <Button
        variant="destructive"
        onClick={() => handleAction("delete")}
        disabled={!!loading}
      >
        {loading === "delete" ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
        Supprimer
      </Button>
    </div>
  );
}
