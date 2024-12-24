"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/components/providers/language-provider";
import { Button } from "@/components/ui/button";
import { NamboodiriTable } from "@/components/namboodiri-table";
import { NamboodiriForm } from "@/components/namboodiri-form";

interface Option {
  id: number;
  nameEn: string;
  nameMl: string;
}

interface Namboodiri {
  id: number;
  nameEn: string;
  nameMl: string;
  gothramId: number;
  illamId: number;
  professionId: number;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  district?: string | null;
  state?: string | null;
  pincode?: string | null;
  gothram: Option;
  illam: Option;
  profession: Option;
}

export default function NamboodiriPage() {
  const { t } = useLanguage();
  const [namboodiris, setNamboodiris] = useState<Namboodiri[]>([]);
  const [gothrams, setGothrams] = useState<Option[]>([]);
  const [illams, setIllams] = useState<Option[]>([]);
  const [professions, setProfessions] = useState<Option[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingNamboodiri, setEditingNamboodiri] = useState<Namboodiri | null>(
    null
  );

  useEffect(() => {
    fetchNamboodiris();
    fetchGothrams();
    fetchIllams();
    fetchProfessions();
  }, []);

  const fetchNamboodiris = async () => {
    try {
      const response = await fetch("/api/namboodiri");
      if (!response.ok) throw new Error("Failed to fetch namboodiris");
      const data = await response.json();
      setNamboodiris(data);
    } catch (error) {
      console.error("Error fetching namboodiris:", error);
    }
  };

  const fetchGothrams = async () => {
    try {
      const response = await fetch("/api/gothram");
      if (!response.ok) throw new Error("Failed to fetch gothrams");
      const data = await response.json();
      setGothrams(data);
    } catch (error) {
      console.error("Error fetching gothrams:", error);
    }
  };

  const fetchIllams = async () => {
    try {
      const response = await fetch("/api/illam");
      if (!response.ok) throw new Error("Failed to fetch illams");
      const data = await response.json();
      setIllams(data);
    } catch (error) {
      console.error("Error fetching illams:", error);
    }
  };

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
      const url = editingNamboodiri
        ? `/api/namboodiri/${editingNamboodiri.id}`
        : "/api/namboodiri";
      const method = editingNamboodiri ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...data,
          gothramId: parseInt(data.gothramId),
          illamId: parseInt(data.illamId),
          professionId: parseInt(data.professionId),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to save namboodiri");
      }

      await fetchNamboodiris();
      setShowForm(false);
      setEditingNamboodiri(null);
    } catch (error) {
      console.error("Error saving namboodiri:", error);
    }
  };

  const handleEdit = (namboodiri: Namboodiri) => {
    setEditingNamboodiri(namboodiri);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("common.confirmDelete"))) return;

    try {
      const response = await fetch(`/api/namboodiri/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete namboodiri");
      }

      await fetchNamboodiris();
    } catch (error) {
      console.error("Error deleting namboodiri:", error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingNamboodiri(null);
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">{t("namboodiri.title")}</h1>
        {!showForm && (
          <Button onClick={() => setShowForm(true)}>
            {t("namboodiri.create")}
          </Button>
        )}
      </div>

      {showForm ? (
        <NamboodiriForm
          initialData={editingNamboodiri}
          gothrams={gothrams}
          illams={illams}
          professions={professions}
          onSubmit={handleSubmit}
          onCancel={handleCancel}
        />
      ) : (
        <NamboodiriTable
          namboodiris={namboodiris}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
