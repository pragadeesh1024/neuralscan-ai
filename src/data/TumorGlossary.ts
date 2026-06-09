export interface GlossaryItem {
  id: string;
  name: string;
  originalName: string;
  severity: 'Benign' | 'Malignant' | 'Inflammatory' | 'Normal';
  summary: string;
  features: string[];
  treatment: string;
}

export const TUMOR_GLOSSARY: GlossaryItem[] = [
  {
    id: 'normal',
    name: 'Normal Brain Tissue',
    originalName: '_NORMAL',
    severity: 'Normal',
    summary: 'Healthy brain structures showing normal ventricular size, clear sulci and gyri, and symmetric cerebral hemispheres without abnormal enhancements or masses.',
    features: ['Symmetric ventricles', 'No abnormal focal contrast enhancements', 'Clear and intact gray-white matter junctions'],
    treatment: 'No intervention required. Periodic routine surveillance if clinically indicated.'
  },
  {
    id: 'glioblastoma',
    name: 'Glioblastoma Multiforme (GBM)',
    originalName: 'Glioblastoma',
    severity: 'Malignant',
    summary: 'The most aggressive and lethal primary brain tumor (WHO Grade IV). Characterized by rapid cellular division, necrosis, and high vascularity, leading to severe edema.',
    features: ['Irregular ring-enhancing mass on T1C+', 'Central area of necrosis (hypointense)', 'Significant surrounding vasogenic edema'],
    treatment: 'Multimodal therapy: maximal surgical resection followed by concurrent temozolomide chemotherapy and radiation therapy.'
  },
  {
    id: 'astrocytoma',
    name: 'Astrocytoma',
    originalName: 'Astrocitoma',
    severity: 'Malignant',
    summary: 'A category of glial tumors arising from star-shaped astrocytes. They range from slow-growing low-grade lesions (WHO Grade I-II) to infiltrative high-grade tumors (WHO Grade III).',
    features: ['Hyperintense on T2-weighted MRI', 'Poorly-defined border in diffuse types', 'Variable contrast enhancement depending on tumor grade'],
    treatment: 'Varies by grade: observation, surgical resection, chemotherapy, or radiotherapy.'
  },
  {
    id: 'meningioma',
    name: 'Meningioma',
    originalName: 'Meningioma',
    severity: 'Benign',
    summary: 'The most common primary brain tumor, arising from the arachnoid cap cells of the meninges. Usually benign (WHO Grade I) and slow-growing, causing symptoms via compression.',
    features: ['Extra-axial mass with distinct boundary', 'Strong homogeneous enhancement', 'Presence of "dural tail" sign along the skull boundary'],
    treatment: 'Active monitoring (watchful waiting) for small asymptomatic lesions; surgical resection or stereotactic radiosurgery for growing/symptomatic tumors.'
  },
  {
    id: 'schwannoma',
    name: 'Schwannoma / Neuroma',
    originalName: 'Schwannoma',
    severity: 'Benign',
    summary: 'Benign nerve sheath tumor arising from Schwann cells, most commonly affecting the vestibulocochlear nerve (acoustic neuroma) in the cerebellopontine angle.',
    features: ['Ice-cream cone shape in CPA cistern', 'Widening of the internal auditory canal', 'Intense enhancement with frequent cystic degeneration'],
    treatment: 'Surgical excision or stereotactic radiosurgery (Gamma Knife) to preserve facial and hearing nerve functions.'
  },
  {
    id: 'oligodendroglioma',
    name: 'Oligodendroglioma',
    severity: 'Malignant',
    originalName: 'Oligodendroglioma',
    summary: 'A slow-growing primary brain tumor arising from oligodendrocytes. Typically located in the frontal lobe and associated with a long history of seizures.',
    features: ['Heterogeneous appearance with cortical expansion', 'Frequent intratumoral calcifications', 'Hyperintense on T2 and fluid-attenuated inversion recovery (FLAIR)'],
    treatment: 'Surgical resection followed by chemotherapy (PCV regimen or temozolomide) and radiation, highly responsive due to 1p19q co-deletion status.'
  },
  {
    id: 'carcinoma',
    name: 'Metastatic Carcinoma',
    originalName: 'Carcinoma',
    severity: 'Malignant',
    summary: 'Secondary brain cancer that has metastasized from a primary cancer elsewhere in the body, most commonly lung, breast, melanoma, or renal cell carcinoma.',
    features: ['Multiple well-circumscribed lesions', 'Located at the gray-white matter junction', 'Disproportionate vasogenic edema relative to lesion size'],
    treatment: 'Systemic chemotherapy, whole-brain radiation therapy (WBRT), stereotactic radiosurgery (SRS), or surgical resection for solitary symptomatic lesions.'
  },
  {
    id: 'ependymoma',
    name: 'Ependymoma',
    originalName: 'Ependimoma',
    severity: 'Malignant',
    summary: 'Glial tumor originating from the ependymal cells lining the ventricles. Most common in the fourth ventricle in children, causing hydrocephalus.',
    features: ['Intraventricular mass showing plastic growth (squeezes through foramina)', 'Heterogeneous enhancement with calcifications and cysts', 'Hydrocephalus (dilated ventricles)'],
    treatment: 'Gross total surgical resection followed by localized radiation therapy.'
  },
  {
    id: 'medulloblastoma',
    name: 'Medulloblastoma',
    originalName: 'Meduloblastoma',
    severity: 'Malignant',
    summary: 'Highly malignant embryonal tumor originating in the cerebellum (posterior fossa), primarily occurring in pediatric patients. Fast growing with risk of CSF seeding.',
    features: ['Solid cerebellar mass in the midline/vermis', 'Restricted diffusion on DWI due to high cell density', 'Moderate to strong enhancement'],
    treatment: 'Aggressive surgical resection, craniospinal irradiation (except in infants), and combination chemotherapy.'
  },
  {
    id: 'tuberculoma',
    name: 'Tuberculoma',
    originalName: 'Tuberculoma',
    severity: 'Inflammatory',
    summary: 'A clinical manifestation of Tuberculosis in the central nervous system, forming a granulomatous infectious mass that mimics a brain tumor on imaging.',
    features: ['Ring-enhancing lesion with central hypointensity', 'Thick contrast-enhancing wall', 'Often accompanied by meningeal enhancement'],
    treatment: 'Anti-tubercular therapy (ATT) drugs (isoniazid, rifampin, pyrazinamide, ethambutol) and corticosteroids to reduce swelling.'
  },
  {
    id: 'granuloma',
    name: 'Infectious Granuloma',
    originalName: 'Granuloma',
    severity: 'Inflammatory',
    summary: 'Localized inflammatory lesions resulting from chronic infections (bacterial, fungal, parasitic like neurocysticercosis) forming mass lesions in the brain parenchyma.',
    features: ['Small, nodular or ring-enhancing lesions', 'Surrounding edema', 'Often self-limiting or responsive to targeted antimicrobials'],
    treatment: 'Targeted antimicrobial/anti-parasitic agents and anti-inflammatory therapy.'
  },
  {
    id: 'ganglioglioma',
    name: 'Ganglioglioma',
    originalName: 'Ganglioglioma',
    severity: 'Benign',
    summary: 'Slow-growing, benign neuroepithelial tumor composed of neoplastic ganglion cells and neoplastic glial cells, frequently causing chronic temporal lobe epilepsy.',
    features: ['Cystic lesion with an enhancing mural nodule', 'Minimal or absent mass effect and edema', 'Cortical location (especially temporal lobe)'],
    treatment: 'Complete surgical resection, which often cures the epilepsy and provides excellent long-term prognosis.'
  },
  {
    id: 'germinoma',
    name: 'Germinoma',
    originalName: 'Germinoma',
    severity: 'Malignant',
    summary: 'A germ-cell tumor primarily located in the midline structures of the brain (pineal gland or suprasellar region), highly responsive to nonsurgical therapies.',
    features: ['Midline pineal/suprasellar mass', 'Homogeneous enhancement', 'Engulfed calcification of the pineal gland'],
    treatment: 'Highly sensitive to chemotherapy and radiation therapy; surgical intervention is usually restricted to biopsy.'
  },
  {
    id: 'neurocytoma',
    name: 'Central Neurocytoma',
    originalName: 'Neurocitoma',
    severity: 'Benign',
    summary: 'Rare, slow-growing intraventricular neuronal tumor, typically found attached to the septum pellucidum in the lateral ventricles of young adults.',
    features: ['Lobulated, "bubbly" intraventricular mass', 'Broad attachment to the septum pellucidum', 'Calcifications and cystic spaces'],
    treatment: 'Surgical resection. Radiation or radiosurgery is reserved for atypical or recurrent cases.'
  }
];
