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
    <main className="min-h-screen bg-gray-50 pb-12 pt-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="my-10 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl md:text-5xl">
            {t.title}
          </h1>
          <p className="mt-3 text-base text-gray-600 sm:text-lg">
            {t.subtitle}
          </p>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-start justify-between gap-2">
            {steps.map((step, index) => (
              <Fragment key={step.number}>
                <div
                  className="flex flex-col items-center gap-2"
                  style={{ flex: '0 0 auto' }}
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full border-2 font-semibold transition-all ${
                      currentStep >= step.number
                        ? 'border-myorange-100 bg-myorange-100 text-white shadow-md'
                        : 'border-gray-300 bg-white text-gray-400'
                    }`}
                  >
                    {currentStep > step.number ? (
                      <CheckCircle2 className="h-6 w-6" />
                    ) : (
                      <span className="text-base">{step.number}</span>
                    )}
                  </div>
                  <span
                    className={`text-center text-xs font-medium sm:text-sm ${
                      currentStep >= step.number
                        ? 'text-gray-900'
                        : 'text-gray-500'
                    }`}
                    style={{ maxWidth: '110px' }}
                  >
                    {step.title}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className="flex items-center pt-6"
                    style={{ flex: '1 1 0%', minWidth: '20px' }}
                  >
                    <div
                      className={`h-0.5 w-full transition-all ${
                        currentStep > step.number
                          ? 'bg-myorange-100'
                          : 'bg-gray-300'
                      }`}
                    />
                  </div>
                )}
              </Fragment>
            ))}
          </div>
        </div>

        {/* Form */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm"
          >
            {/* Step 1: Type & Objectif */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.step1.title}
                </h2>

                <FormField
                  name="projectType"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step1.projectType.label} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t.step1.projectType.placeholder}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                            value={t.step1.projectType.options.landing}
                          >
                            {t.step1.projectType.options.landing}
                          </SelectItem>
                          <SelectItem value={t.step1.projectType.options.other}>
                            {t.step1.projectType.options.other}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {projectType === t.step1.projectType.options.other && (
                  <FormField
                    name="projectTypeOther"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.step1.projectType.otherLabel}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.step1.projectType.otherPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  name="mainObjective"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step1.mainObjective.label} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t.step1.mainObjective.placeholder}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={t.step1.mainObjective.options.presentation}
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
                            value={t.step1.mainObjective.options.client_area}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {mainObjective === t.step1.mainObjective.options.other && (
                  <FormField
                    name="mainObjectiveOther"
                    control={form.control}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {t.step1.mainObjective.otherLabel}
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t.step1.mainObjective.otherPlaceholder}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            )}

            {/* Step 2: Contenu & Fonctionnalités */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.step2.title}
                </h2>

                <FormField
                  name="plannedContent"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step2.plannedContent.label} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t.step2.plannedContent.placeholder}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="features"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        {t.step2.features.label} * {t.step2.features.sublabel}
                      </FormLabel>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {features.map((feature) => (
                          <div
                            key={feature}
                            onClick={() => toggleFeature(feature)}
                            className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${
                              selectedFeatures.includes(feature)
                                ? 'border-myorange-100 bg-myorange-100/10 text-myorange-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {feature}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="featuresOther"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step2.features.otherLabel}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.step2.features.otherPlaceholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 3: Identité & Design */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.step3.title}
                </h2>

                <FormField
                  name="contentAvailability"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t.step3.contentAvailability.label} *
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={
                                t.step3.contentAvailability.placeholder
                              }
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={t.step3.contentAvailability.options.ready}
                          >
                            {t.step3.contentAvailability.options.ready}
                          </SelectItem>
                          <SelectItem
                            value={t.step3.contentAvailability.options.partial}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="visualIdentity"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step3.visualIdentity.label} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t.step3.visualIdentity.placeholder}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem
                            value={t.step3.visualIdentity.options.logo_chart}
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="currentWebsite"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t.step3.currentWebsite.label}{' '}
                        {t.step3.currentWebsite.sublabel}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.step3.currentWebsite.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="improvementNotes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step3.improvementNotes.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.step3.improvementNotes.placeholder}
                          rows={4}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 4: Planning & Priorités */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.step4.title}
                </h2>

                <FormField
                  name="deadline"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step4.deadline.label} *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue
                              placeholder={t.step4.deadline.placeholder}
                            />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
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
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="priorities"
                  control={form.control}
                  render={() => (
                    <FormItem>
                      <FormLabel>
                        {t.step4.priorities.label} *{' '}
                        {t.step4.priorities.sublabel}
                      </FormLabel>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        {priorities.map((priority) => (
                          <div
                            key={priority}
                            onClick={() => togglePriority(priority)}
                            className={`cursor-pointer rounded-lg border p-3 text-sm transition-colors ${
                              selectedPriorities.includes(priority)
                                ? 'border-myorange-100 bg-myorange-100/10 text-myorange-100'
                                : 'border-gray-200 hover:border-gray-300'
                            }`}
                          >
                            {priority}
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="additionalNotes"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step4.additionalNotes.label}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder={t.step4.additionalNotes.placeholder}
                          rows={5}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Step 5: Coordonnées */}
            {currentStep === 5 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-semibold text-gray-900">
                  {t.step5.title}
                </h2>

                <FormField
                  name="name"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step5.name.label} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t.step5.name.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="email"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.step5.email.label} *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t.step5.email.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  name="phone"
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {t.step5.phone.label} {t.step5.phone.sublabel}
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="tel"
                          placeholder={t.step5.phone.placeholder}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 flex items-center justify-between gap-4 border-t border-gray-200 pt-6">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  onClick={prevStep}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  {t.buttons.previous}
                </Button>
              ) : (
                <div />
              )}

              {currentStep < 5 ? (
                <Button
                  type="button"
                  onClick={nextStep}
                  className="ml-auto flex items-center gap-2 bg-myorange-100 text-white hover:bg-myorange-200"
                >
                  {t.buttons.next}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-auto flex items-center gap-2 bg-myorange-100 text-white hover:bg-myorange-200 disabled:cursor-not-allowed disabled:opacity-80"
                >
                  {isSubmitting ? (
                    <span>{t.buttons.submitting}</span>
                  ) : (
                    <>
                      <span>{t.buttons.submit}</span>
                      <ArrowRight className="h-4 w-4" />
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
