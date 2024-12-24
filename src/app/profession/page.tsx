"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { ProfessionTable } from "@/components/profession-table";
import { ProfessionForm } from "@/components/profession-form";

interface Profession {
  id: number;
  nameEn: string;
  nameMl: string;
}

export default function ProfessionPage() {
  const { t } = useLanguage();
  const [professions, setProfessions] = useState<Profession[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingProfession, setEditingProfession] = useState<Profession | null>(
    null
  );

  useEffect(() => {
    fetchProfessions();
  }, []);

  const fetchProfessions = async () => {
    try {
      const response = await fetch("/api/profession");
      if (!response.ok) throw new Error("Failed to fetch professions");
      const data = await response.json();
      setProfessions(data);
    } catch (error) {
      console.error("Error fetching professions:", error);
    }
  };

  const handleSubmit = async (data: any) => {
    try {
      const url = editingProfession
        ? `/api/profession/${editingProfession.id}`
        : "/api/profession";
      const method = editingProfession ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to save profession");
      }

      await fetchProfessions();
      setShowForm(false);
      setEditingProfession(null);
    } catch (error) {
      console.error("Error saving profession:", error);
    }
  };

  const handleEdit = (profession: Profession) => {
    setEditingProfession(profession);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete"))) return;

    try {
      const response = await fetch(`/api/profession/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete profession");
      }

      await fetchProfessions();
    } catch (error) {
      console.error("Error deleting profession:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProfession(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("profession.title")}</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            {t("profession.create")}
          </Button>
        )}
      </div>

      {showForm ? (
        <ProfessionForm
          initialData={editingProfession}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <ProfessionTable
          professions={professions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
