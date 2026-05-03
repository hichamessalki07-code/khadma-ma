import { prisma } from "@/lib/prisma";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatDate } from "@/lib/utils";
import { UserX, Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { profile: { select: { firstName: true, lastName: true } } },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Utilisateurs</h1>
          <p className="text-gray-500 mt-1">{users.length} utilisateur{users.length > 1 ? "s" : ""}</p>
        </div>
        <Input placeholder="Rechercher..." className="w-64" />
      </div>

      <Card className="border-gray-200">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Utilisateur</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Rôle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Statut</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Inscrit le</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map((u) => {
                  const name = u.profile
                    ? `${u.profile.firstName} ${u.profile.lastName}`
                    : u.email;
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center">
                            <span className="text-xs font-bold text-brand-700">{u.email.charAt(0).toUpperCase()}</span>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <Badge
                          variant={u.role === "ADMIN" ? "default" : u.role === "EMPLOYER" ? "info" : "secondary"}
                          className="text-xs"
                        >
                          {u.role === "ADMIN" ? "Admin" : u.role === "EMPLOYER" ? "Recruteur" : "Candidat"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant={u.isActive ? "success" : "destructive"} className="text-xs">
                          {u.isActive ? "Actif" : "Inactif"}
                        </Badge>
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-xs">{formatDate(u.createdAt)}</td>
                      <td className="py-3 px-4">
                        <div className="flex gap-1">
                          <Button variant="ghost" size="sm" className="h-7 text-xs">
                            <Shield className="h-3 w-3 mr-1" />
                            Rôle
                          </Button>
                          <Button variant="ghost" size="sm" className="h-7 text-xs text-red-600 hover:bg-red-50">
                            <UserX className="h-3 w-3 mr-1" />
                            {u.isActive ? "Suspendre" : "Activer"}
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
