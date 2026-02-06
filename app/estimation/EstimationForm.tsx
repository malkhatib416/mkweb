'use client';

import { Fragment, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { sendMail } from '@/utils/send-mail';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, ArrowLeft, CheckCircle2 } from 'lucide-react';
import { useReCaptcha } from 'next-recaptcha-v3';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { EMAIL } from '@/utils/consts';
import type { Dictionary } from '@/locales/dictionaries';

const SIGNATURE = `Mohamad Al-Khatib
MK-Web — Développement web & mobile
🌐 https://mk-web.fr
📞 06 46 77 78 04`;

type Props = {
  dict: Dictionary;
};

export default function EstimationForm({ dict }: Props) {
  const t = dict.estimation;

  const formSchema = z.object({
    projectType: z.string().min(1, t.step1.projectType.required),
    projectTypeOther: z.string().optional(),
    mainObjective: z.string().min(1, t.step1.mainObjective.required),
    mainObjectiveOther: z.string().optional(),
    plannedContent: z.string().min(1, t.step2.plannedContent.required),
    features: z.array(z.string()).min(1, t.step2.features.required),
    featuresOther: z.string().optional(),
    contentAvailability: z
      .string()
      .min(1, t.step3.contentAvailability.required),
    visualIdentity: z.string().min(1, t.step3.visualIdentity.required),
    currentWebsite: z.string().optional(),
    improvementNotes: z.string().optional(),
    deadline: z.string().min(1, t.step4.deadline.required),
    priorities: z.array(z.string()).min(1, t.step4.priorities.required),
    additionalNotes: z.string().optional(),
    name: z.string().min(1, t.step5.name.required),
    email: z.string().email(t.step5.email.required),
    phone: z.string().optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const sendEstimationMail = async (
    formData: FormValues,
    recaptchaToken: string,
  ) => {
    const featuresText =
      formData.features.join(', ') +
      (formData.featuresOther
        ? ` (${t.email.other}: ${formData.featuresOther})`
        : '');
    const prioritiesText = formData.priorities.join(', ');

    await sendMail({
      email: EMAIL!,
      subject: `${t.email.newRequest} - ${formData.name}`,
      text: t.email.newRequest,
      recaptchaToken,
      fromName: 'MK-Web Estimation de Projet',
      html: `
        <h1>${t.email.newRequest}</h1>
        
        <h2>${t.email.projectInfo}</h2>
        <ul>
          <li><strong>${t.email.projectType}:</strong> ${formData.projectType}${formData.projectTypeOther ? ` (${formData.projectTypeOther})` : ''}</li>
          <li><strong>${t.email.mainObjective}:</strong> ${formData.mainObjective}${formData.mainObjectiveOther ? ` (${formData.mainObjectiveOther})` : ''}</li>
          <li><strong>${t.email.plannedContent}:</strong> ${formData.plannedContent}</li>
          <li><strong>${t.email.features}:</strong> ${featuresText}</li>
          <li><strong>${t.email.contentAvailability}:</strong> ${formData.contentAvailability}</li>
          <li><strong>${t.email.visualIdentity}:</strong> ${formData.visualIdentity}</li>
          ${formData.currentWebsite ? `<li><strong>${t.email.currentWebsite}:</strong> ${formData.currentWebsite}</li>` : ''}
          ${formData.improvementNotes ? `<li><strong>${t.email.improvements}:</strong> ${formData.improvementNotes}</li>` : ''}
          <li><strong>${t.email.deadline}:</strong> ${formData.deadline}</li>
          <li><strong>${t.email.priorities}:</strong> ${prioritiesText}</li>
          ${formData.additionalNotes ? `<li><strong>${t.email.additionalNotes}:</strong> ${formData.additionalNotes}</li>` : ''}
        </ul>

        <h2>${t.email.contactInfo}</h2>
        <ul>
          <li><strong>${t.email.name}:</strong> ${formData.name}</li>
          <li><strong>${t.email.email}:</strong> ${formData.email}</li>
          ${formData.phone ? `<li><strong>${t.email.phone}:</strong> ${formData.phone}</li>` : ''}
        </ul>
      `,
    });
  };

  const sendClientConfirmation = async (
    formData: FormValues,
    recaptchaToken: string,
  ) => {
    const featuresText =
      formData.features.join(', ') +
      (formData.featuresOther
        ? ` (${t.email.other}: ${formData.featuresOther})`
        : '');
    const prioritiesText = formData.priorities.join(', ');

    await sendMail({
      email: formData.email,
      subject: t.email.confirmation.subject,
      text: `${t.email.confirmation.greeting} ${formData.name},\n\n${t.email.confirmation.received}\n\n${t.email.confirmation.followUp}\n\n${SIGNATURE}`,
      recaptchaToken,
      fromName: 'MK-Web Estimation de Projet',
      html: `
        <h1>${t.email.confirmation.greeting} ${formData.name},</h1>
        <p>${t.email.confirmation.received}</p>
        <p>${t.email.confirmation.followUp}</p>
        
        <h2 style="margin-top: 30px; color: #333;">${t.email.confirmation.summary}</h2>
        
        <h3 style="color: #555; margin-top: 20px;">${t.email.projectInfo}</h3>
        <ul style="line-height: 1.8;">
          <li><strong>${t.email.projectType}:</strong> ${formData.projectType}${formData.projectTypeOther ? ` (${formData.projectTypeOther})` : ''}</li>
          <li><strong>${t.email.mainObjective}:</strong> ${formData.mainObjective}${formData.mainObjectiveOther ? ` (${formData.mainObjectiveOther})` : ''}</li>
          <li><strong>${t.email.plannedContent}:</strong> ${formData.plannedContent}</li>
          <li><strong>${t.email.features}:</strong> ${featuresText}</li>
          <li><strong>${t.email.contentAvailability}:</strong> ${formData.contentAvailability}</li>
          <li><strong>${t.email.visualIdentity}:</strong> ${formData.visualIdentity}</li>
          ${formData.currentWebsite ? `<li><strong>${t.email.currentWebsite}:</strong> ${formData.currentWebsite}</li>` : ''}
          ${formData.improvementNotes ? `<li><strong>${t.email.improvements}:</strong> ${formData.improvementNotes}</li>` : ''}
          <li><strong>${t.email.deadline}:</strong> ${formData.deadline}</li>
          <li><strong>${t.email.priorities}:</strong> ${prioritiesText}</li>
          ${formData.additionalNotes ? `<li><strong>${t.email.additionalNotes}:</strong> ${formData.additionalNotes}</li>` : ''}
        </ul>
        
        <br>
        <p style="white-space: pre-line;">${SIGNATURE}</p>
      `,
    });
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { executeRecaptcha } = useReCaptcha();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: 'onChange',
    defaultValues: {
      projectType: '',
      projectTypeOther: '',
      mainObjective: '',
      mainObjectiveOther: '',
      plannedContent: '',
      features: [],
      featuresOther: '',
      contentAvailability: '',
      visualIdentity: '',
      currentWebsite: '',
      improvementNotes: '',
      deadline: '',
      priorities: [],
      additionalNotes: '',
      name: '',
      email: '',
      phone: '',
    },
  });

  const projectType = form.watch('projectType');
  const mainObjective = form.watch('mainObjective');
  const selectedFeatures = form.watch('features');
  const selectedPriorities = form.watch('priorities');

  const toggleFeature = (feature: string) => {
    const current = form.getValues('features');
    const updated = current.includes(feature)
      ? current.filter((f) => f !== feature)
      : [...current, feature];
    form.setValue('features', updated, { shouldValidate: true });
  };

  const togglePriority = (priority: string) => {
    const current = form.getValues('priorities');
    const updated = current.includes(priority)
      ? current.filter((p) => p !== priority)
      : [...current, priority];
    form.setValue('priorities', updated, { shouldValidate: true });
  };

  const validateStep = async (step: number): Promise<boolean> => {
    let fieldsToValidate: (keyof FormValues)[] = [];

    switch (step) {
      case 1:
        fieldsToValidate = ['projectType', 'mainObjective'];
        if (
          form.getValues('projectType') === t.step1.projectType.options.other
        ) {
          fieldsToValidate.push('projectTypeOther');
        }
        if (
          form.getValues('mainObjective') ===
          t.step1.mainObjective.options.other
        ) {
          fieldsToValidate.push('mainObjectiveOther');
        }
        break;
      case 2:
        fieldsToValidate = ['plannedContent', 'features'];
        break;
      case 3:
        fieldsToValidate = ['contentAvailability', 'visualIdentity'];
        break;
      case 4:
        fieldsToValidate = ['deadline', 'priorities'];
        break;
      case 5:
        fieldsToValidate = ['name', 'email'];
        break;
    }

    const result = await form.trigger(fieldsToValidate);

    if (!result) {
      toast({
        title: t.toast.validationError,
        description: t.toast.validationErrorDesc,
        variant: 'destructive',
      });
    }

    return result;
  };

  const nextStep = async () => {
    const isValid = await validateStep(currentStep);
    if (isValid && currentStep < 5) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const onSubmit = async (values: FormValues) => {
    try {
      const tokenEstimation = await executeRecaptcha('estimation_mail');
      const tokenConfirmation = await executeRecaptcha('confirmation_mail');

      setIsSubmitting(true);
      await sendEstimationMail(values, tokenEstimation);
      await sendClientConfirmation(values, tokenConfirmation);

      toast({
        title: t.toast.success,
        description: t.toast.successDesc,
      });
      form.reset();
      setCurrentStep(1);
    } catch (error) {
      console.error('Error sending estimation: ', error);
      toast({
        title: t.toast.error,
        description: t.toast.errorDesc,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const features = [
    t.step2.features.options.simple_form,
    t.step2.features.options.advanced_form,
    t.step2.features.options.blog,
    t.step2.features.options.gallery,
    t.step2.features.options.booking,
    t.step2.features.options.catalog,
    t.step2.features.options.payment,
    t.step2.features.options.client_area,
    t.step2.features.options.downloads,
    t.step2.features.options.reviews,
    t.step2.features.options.newsletter,
    t.step2.features.options.chat,
    t.step2.features.options.multilingual,
  ];

  const priorities = [
    t.step4.priorities.options.speed,
    t.step4.priorities.options.design,
    t.step4.priorities.options.seo,
    t.step4.priorities.options.ux,
    t.step4.priorities.options.autonomy,
    t.step4.priorities.options.support,
  ];

  const steps = [
    { number: 1, title: t.steps.step1 },
    { number: 2, title: t.steps.step2 },
    { number: 3, title: t.steps.step3 },
    { number: 4, title: t.steps.step4 },
    { number: 5, title: t.steps.step5 },
  ];

  return (
    <main className="min-h-screen bg-white dark:bg-slate-950 dot-grid pb-24 pt-32 relative overflow-hidden transition-colors duration-500">
      {/* Background radial gradient for focus */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,white_80%)] dark:bg-[radial-gradient(circle_at_center,transparent_0%,#030712_80%)] pointer-events-none" />

      <div className="mx-auto max-w-5xl px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-20 text-center">
          <div className="inline-flex items-center gap-2.5 bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wide mb-8 shadow-sm">
            <CheckCircle2 className="w-3.5 h-3.5 text-myorange-100" />
            {t.steps[`step${currentStep}` as keyof typeof t.steps]}
          </div>
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-slate-900 dark:text-white mb-8">
            {t.title}
          </h1>
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed font-medium">
            {t.subtitle}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-16">
          {/* Desktop Steps */}
          <div className="hidden sm:flex items-start justify-between gap-4 max-w-4xl mx-auto">
            {steps.map((step, index) => (
              <Fragment key={step.number}>
                <div
                  className="flex flex-col items-center gap-3"
                  style={{ flex: '0 0 auto' }}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300 ${
                      currentStep >= step.number
                        ? 'border-slate-900 bg-slate-900 dark:border-white dark:bg-white text-white dark:text-slate-950 shadow-lg shadow-slate-200 dark:shadow-none'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-400 dark:text-slate-600'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-5 w-5" />
                    ) : (
                      <span className="text-sm font-bold">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`text-center text-[11px] font-bold uppercase tracking-wider ${
                      currentStep >= step.number
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-400 dark:text-slate-600'
                    }`}
                    style={{ maxWidth: '100px' }}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="flex items-center pt-5"
                    style={{ flex: '1 1 0%', minWidth: '20px' }}
                  >
                    <div
                      className={`h-[1px] w-full transition-all duration-500 ${
                        currentStep > step.number
                          ? 'bg-slate-900 dark:bg-white'
                          : 'bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>

          {/* Mobile Steps */}
          <div className="block sm:hidden">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {t.steps[`step${currentStep}` as keyof typeof t.steps]}
              </span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {currentStep} / {steps.length}
              </span>
            </div>
            <div className="h-1 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full bg-slate-900 dark:bg-white transition-all duration-500 ease-in-out"
                style={{ width: `${(currentStep / steps.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm p-6 sm:p-12 shadow-[0_0_50px_-12px_rgba(0,0,0,0.05)] relative overflow-hidden"
          >
            {/* Subtle inner glow for the form container */}
            <div className="absolute inset-0 bg-gradient-to-br from-myorange-100/[0.02] to-transparent pointer-events-none" />

            <div className="relative z-10">
              {/* Step 1: Type & Objectif */}
              {currentStep === 1 && (
                <div className="space-y-8">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {t.step1.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      name="projectType"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step1.projectType.label} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20 transition-all">
                                <SelectValue
                                  placeholder={t.step1.projectType.placeholder}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950">
                              <SelectItem
                                value={t.step1.projectType.options.showcase}
                              >
                                {t.step1.projectType.options.showcase}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.projectType.options.redesign}
                              >
                                {t.step1.projectType.options.redesign}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.projectType.options.ecommerce}
                              >
                                {t.step1.projectType.options.ecommerce}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.projectType.options.webapp}
                              >
                                {t.step1.projectType.options.webapp}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.projectType.options.mobileapp}
                              >
                                {t.step1.projectType.options.mobileapp}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.projectType.options.other}
                              >
                                {t.step1.projectType.options.other}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="mainObjective"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step1.mainObjective.label} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20 transition-all">
                                <SelectValue
                                  placeholder={
                                    t.step1.mainObjective.placeholder
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-200/60">
                              <SelectItem
                                value={
                                  t.step1.mainObjective.options.presentation
                                }
                              >
                                {t.step1.mainObjective.options.presentation}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.mainObjective.options.leads}
                              >
                                {t.step1.mainObjective.options.leads}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.mainObjective.options.sell}
                              >
                                {t.step1.mainObjective.options.sell}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.mainObjective.options.modernize}
                              >
                                {t.step1.mainObjective.options.modernize}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.mainObjective.options.automate}
                              >
                                {t.step1.mainObjective.options.automate}
                              </SelectItem>
                              <SelectItem
                                value={
                                  t.step1.mainObjective.options.client_area
                                }
                              >
                                {t.step1.mainObjective.options.client_area}
                              </SelectItem>
                              <SelectItem
                                value={t.step1.mainObjective.options.other}
                              >
                                {t.step1.mainObjective.options.other}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />
                  </div>

                  {(projectType === t.step1.projectType.options.other ||
                    mainObjective === t.step1.mainObjective.options.other) && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">
                      {projectType === t.step1.projectType.options.other && (
                        <FormField
                          name="projectTypeOther"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 block">
                                {t.step1.projectType.otherLabel}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                                  placeholder={
                                    t.step1.projectType.otherPlaceholder
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] font-mono" />
                            </FormItem>
                          )}
                        />
                      )}

                      {mainObjective ===
                        t.step1.mainObjective.options.other && (
                        <FormField
                          name="mainObjectiveOther"
                          control={form.control}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-[10px] font-mono uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-3 block">
                                {t.step1.mainObjective.otherLabel}
                              </FormLabel>
                              <FormControl>
                                <Input
                                  className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                                  placeholder={
                                    t.step1.mainObjective.otherPlaceholder
                                  }
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage className="text-[10px] font-mono" />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>
                  )}
                </div>
              )}

              {/* Step 2: Contenu & Fonctionnalités */}
              {currentStep === 2 && (
                <div className="space-y-10">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {t.step2.title}
                    </h2>
                  </div>

                  <FormField
                    name="plannedContent"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="max-w-md">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                          {t.step2.plannedContent.label} *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl">
                              <SelectValue
                                placeholder={t.step2.plannedContent.placeholder}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950">
                            <SelectItem
                              value={t.step2.plannedContent.options['1-3']}
                            >
                              {t.step2.plannedContent.options['1-3']}
                            </SelectItem>
                            <SelectItem
                              value={t.step2.plannedContent.options['4-7']}
                            >
                              {t.step2.plannedContent.options['4-7']}
                            </SelectItem>
                            <SelectItem
                              value={t.step2.plannedContent.options['8-15']}
                            >
                              {t.step2.plannedContent.options['8-15']}
                            </SelectItem>
                            <SelectItem
                              value={t.step2.plannedContent.options['15plus']}
                            >
                              {t.step2.plannedContent.options['15plus']}
                            </SelectItem>
                            <SelectItem
                              value={t.step2.plannedContent.options.unknown}
                            >
                              {t.step2.plannedContent.options.unknown}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="features"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 block">
                          {t.step2.features.label} *{' '}
                          <span className="text-slate-400 dark:text-slate-500 normal-case tracking-normal">
                            ({t.step2.features.sublabel})
                          </span>
                        </FormLabel>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                          {features.map((feature) => (
                            <div
                              key={feature}
                              onClick={() => toggleFeature(feature)}
                              className={`
                                cursor-pointer group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3
                                ${
                                  selectedFeatures.includes(feature)
                                    ? 'border-myorange-100 bg-white dark:bg-slate-900 ring-1 ring-myorange-100/20 shadow-[0_10px_30px_-10px_rgba(238,127,34,0.15)]'
                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
                                }
                              `}
                            >
                              {selectedFeatures.includes(feature) && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle2 className="w-4 h-4 text-myorange-100" />
                                </div>
                              )}
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${selectedFeatures.includes(feature) ? 'text-myorange-100' : 'text-slate-500 dark:text-slate-400'}`}
                              >
                                {feature}
                              </span>
                            </div>
                          ))}
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="featuresOther"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="max-w-md pt-4">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                          {t.step2.features.otherLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                            placeholder={t.step2.features.otherPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 3: Identité & Design */}
              {currentStep === 3 && (
                <div className="space-y-8">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {t.step3.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      name="contentAvailability"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step3.contentAvailability.label} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20">
                                <SelectValue
                                  placeholder={
                                    t.step3.contentAvailability.placeholder
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950">
                              <SelectItem
                                value={
                                  t.step3.contentAvailability.options.ready
                                }
                              >
                                {t.step3.contentAvailability.options.ready}
                              </SelectItem>
                              <SelectItem
                                value={
                                  t.step3.contentAvailability.options.partial
                                }
                              >
                                {t.step3.contentAvailability.options.partial}
                              </SelectItem>
                              <SelectItem
                                value={t.step3.contentAvailability.options.none}
                              >
                                {t.step3.contentAvailability.options.none}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="visualIdentity"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step3.visualIdentity.label} *
                          </FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20">
                                <SelectValue
                                  placeholder={
                                    t.step3.visualIdentity.placeholder
                                  }
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950">
                              <SelectItem
                                value={
                                  t.step3.visualIdentity.options.logo_chart
                                }
                              >
                                {t.step3.visualIdentity.options.logo_chart}
                              </SelectItem>
                              <SelectItem
                                value={t.step3.visualIdentity.options.logo_only}
                              >
                                {t.step3.visualIdentity.options.logo_only}
                              </SelectItem>
                              <SelectItem
                                value={t.step3.visualIdentity.options.redesign}
                              >
                                {t.step3.visualIdentity.options.redesign}
                              </SelectItem>
                              <SelectItem
                                value={t.step3.visualIdentity.options.create}
                              >
                                {t.step3.visualIdentity.options.create}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="currentWebsite"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step3.currentWebsite.label}{' '}
                            <span className="text-slate-400 dark:text-slate-500 normal-case tracking-normal">
                              ({t.step3.currentWebsite.sublabel})
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                              placeholder={t.step3.currentWebsite.placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="improvementNotes"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step3.improvementNotes.label}
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-2xl focus:ring-myorange-100/20"
                              placeholder={t.step3.improvementNotes.placeholder}
                              rows={4}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Step 4: Planning & Priorités */}
              {currentStep === 4 && (
                <div className="space-y-10">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {t.step4.title}
                    </h2>
                  </div>

                  <FormField
                    name="deadline"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem className="max-w-md">
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                          {t.step4.deadline.label} *
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20">
                              <SelectValue
                                placeholder={t.step4.deadline.placeholder}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="rounded-xl border-slate-200/60 dark:border-slate-800/60 dark:bg-slate-950">
                            <SelectItem value={t.step4.deadline.options.asap}>
                              {t.step4.deadline.options.asap}
                            </SelectItem>
                            <SelectItem
                              value={t.step4.deadline.options['2-4weeks']}
                            >
                              {t.step4.deadline.options['2-4weeks']}
                            </SelectItem>
                            <SelectItem
                              value={t.step4.deadline.options['1-2months']}
                            >
                              {t.step4.deadline.options['1-2months']}
                            </SelectItem>
                            <SelectItem
                              value={t.step4.deadline.options.no_deadline}
                            >
                              {t.step4.deadline.options.no_deadline}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="priorities"
                    control={form.control}
                    render={() => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-6 block">
                          {t.step4.priorities.label} *{' '}
                          <span className="text-slate-400 dark:text-slate-500 normal-case tracking-normal">
                            ({t.step4.priorities.sublabel})
                          </span>
                        </FormLabel>
                        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                          {priorities.map((priority) => (
                            <div
                              key={priority}
                              onClick={() => togglePriority(priority)}
                              className={`
                                cursor-pointer group relative p-4 rounded-2xl border transition-all duration-300 flex flex-col items-center text-center gap-3
                                ${
                                  selectedPriorities.includes(priority)
                                    ? 'border-myorange-100 bg-white dark:bg-slate-900 ring-1 ring-myorange-100/20 shadow-[0_10px_30px_-10px_rgba(238,127,34,0.15)]'
                                    : 'border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-900 hover:border-slate-200 dark:hover:border-slate-700 hover:shadow-sm'
                                }
                              `}
                            >
                              {selectedPriorities.includes(priority) && (
                                <div className="absolute top-2 right-2">
                                  <CheckCircle2 className="w-4 h-4 text-myorange-100" />
                                </div>
                              )}
                              <span
                                className={`text-[11px] font-bold uppercase tracking-wide transition-colors ${selectedPriorities.includes(priority) ? 'text-myorange-100' : 'text-slate-500 dark:text-slate-400'}`}
                              >
                                {priority}
                              </span>
                            </div>
                          ))}
                        </div>
                        <FormMessage className="text-xs" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    name="additionalNotes"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                          {t.step4.additionalNotes.label}
                        </FormLabel>
                        <FormControl>
                          <Textarea
                            className="bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-2xl focus:ring-myorange-100/20"
                            placeholder={t.step4.additionalNotes.placeholder}
                            rows={5}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[10px] font-mono" />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              {/* Step 5: Coordonnées */}
              {currentStep === 5 && (
                <div className="space-y-8">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                      {t.step5.title}
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <FormField
                      name="name"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step5.name.label} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                              placeholder={t.step5.name.placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="email"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step5.email.label} *
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                              type="email"
                              placeholder={t.step5.email.placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />

                    <FormField
                      name="phone"
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="md:col-span-2">
                          <FormLabel className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3 block">
                            {t.step5.phone.label}{' '}
                            <span className="text-slate-400 dark:text-slate-500 normal-case tracking-normal">
                              ({t.step5.phone.sublabel})
                            </span>
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="h-12 bg-white dark:bg-slate-950 border-slate-200/60 dark:border-slate-800/60 rounded-xl focus:ring-myorange-100/20"
                              type="tel"
                              placeholder={t.step5.phone.placeholder}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-[10px] font-mono" />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Navigation Buttons */}
            <div className="mt-16 flex items-center justify-between gap-4 border-t border-slate-100 dark:border-slate-800 pt-10 relative z-10">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="ghost"
                  className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  {t.buttons.previous}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-xs font-bold uppercase tracking-wider px-8 rounded-xl h-12 shadow-lg shadow-slate-200 dark:shadow-none"
                >
                  {t.buttons.next}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto flex items-center gap-2.5 bg-slate-900 dark:bg-white text-white dark:text-slate-950 hover:bg-slate-800 dark:hover:bg-slate-200 transition-all text-xs font-bold uppercase tracking-wider px-8 rounded-xl h-12 shadow-lg shadow-slate-200 dark:shadow-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>{t.buttons.submitting}</span>
                  ) : (
                    <>
                      <span>{t.buttons.submit}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </div>
    </main>
  );
}
