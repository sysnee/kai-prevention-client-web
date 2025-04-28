export function formatCNPJ(cnpj: string): string {
  if (!cnpj) return '';
  
  // Remove caracteres não numéricos
  const digits = cnpj.replace(/\D/g, '');
  
  // Aplica formatação XX.XXX.XXX/XXXX-XX
  return digits
    .replace(/^(\d{2})(\d)/, '$1.$2')
    .replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/\.(\d{3})(\d)/, '.$1/$2')
    .replace(/(\d{4})(\d)/, '$1-$2')
    .substr(0, 18);
}

export function formatPhone(phone: string): string {
  if (!phone) return '';
  
  // Remove caracteres não numéricos
  const digits = phone.replace(/\D/g, '');
  
  // Verifica se é um celular (11 dígitos) ou telefone fixo (10 dígitos)
  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
      .substr(0, 14);
  } else {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{5})(\d)/, '$1-$2')
      .substr(0, 15);
  }
}

export function formatCEP(cep: string): string {
  if (!cep) return '';
  
  // Remove caracteres não numéricos
  const digits = cep.replace(/\D/g, '');
  
  // Aplica formatação XXXXX-XXX
  return digits.replace(/^(\d{5})(\d{3})?$/, '$1-$2').substr(0, 9);
}

export function unformatValue(value: string): string {
  return value ? value.replace(/\D/g, '') : '';
}

export function processBusinessHours(businessHours: any[]) {
  return businessHours.map(hour => ({
    ...hour,
    opens_at: hour.opens_at.substring(0, 5),
    closes_at: hour.closes_at.substring(0, 5)
  }));
}

export function formatDateTime(dateString: string): string {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
} 