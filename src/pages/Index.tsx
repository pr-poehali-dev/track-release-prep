import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

export default function Index() {
  const [activeTab, setActiveTab] = useState<'upload' | 'releases'>('upload');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [trackName, setTrackName] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [artist, setArtist] = useState('');
  const [showPreview, setShowPreview] = useState(false);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const { toast } = useToast();

  const handleAudioUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('audio/')) {
        setAudioFile(file);
        toast({
          title: 'Аудио загружено',
          description: file.name,
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Пожалуйста, выберите аудио файл',
          variant: 'destructive',
        });
      }
    }
  };

  const handleCoverUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        setCoverFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setCoverPreview(reader.result as string);
        };
        reader.readAsDataURL(file);
        toast({
          title: 'Обложка загружена',
          description: file.name,
        });
      } else {
        toast({
          title: 'Ошибка',
          description: 'Пожалуйста, выберите изображение',
          variant: 'destructive',
        });
      }
    }
  };

  const handleGenerateRelease = () => {
    if (!audioFile || !coverFile || !trackName) {
      toast({
        title: 'Заполните все поля',
        description: 'Загрузите аудио, обложку и укажите название трека',
        variant: 'destructive',
      });
      return;
    }
    setShowPreview(true);
    toast({
      title: 'Релиз готов!',
      description: 'Ваш трек готов к публикации',
    });
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: 'Скопировано',
      description: 'Ссылка скопирована в буфер обмена',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <header className="border-b bg-background/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Music" className="text-primary-foreground" size={24} />
              </div>
              <h1 className="text-2xl font-semibold">Music Release</h1>
            </div>
            <nav className="flex gap-2">
              <Button
                variant={activeTab === 'upload' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('upload')}
                className="gap-2"
              >
                <Icon name="Upload" size={18} />
                Загрузка трека
              </Button>
              <Button
                variant={activeTab === 'releases' ? 'default' : 'ghost'}
                onClick={() => setActiveTab('releases')}
                className="gap-2"
              >
                <Icon name="List" size={18} />
                Мои релизы
              </Button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {activeTab === 'upload' && !showPreview && (
          <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="text-center space-y-3 mb-12">
              <h2 className="text-4xl font-bold">Подготовь трек к релизу</h2>
              <p className="text-muted-foreground text-lg">
                Загрузи аудио и обложку, чтобы создать страницу релиза
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Music" className="text-primary" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Аудио файл</h3>
                    <p className="text-sm text-muted-foreground">MP3, WAV, FLAC</p>
                  </div>
                </div>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="audio-upload"
                    accept="audio/*"
                    onChange={handleAudioUpload}
                    className="hidden"
                  />
                  <label htmlFor="audio-upload" className="cursor-pointer space-y-2 block">
                    <Icon name="FileAudio" className="mx-auto text-muted-foreground" size={40} />
                    {audioFile ? (
                      <div className="space-y-1">
                        <p className="font-medium">{audioFile.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-medium">Выберите файл или перетащите</p>
                        <p className="text-sm text-muted-foreground">Максимум 50 MB</p>
                      </div>
                    )}
                  </label>
                </div>
              </Card>

              <Card className="p-6 space-y-4 hover:shadow-lg transition-shadow">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center">
                    <Icon name="Image" className="text-accent" size={24} />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">Обложка</h3>
                    <p className="text-sm text-muted-foreground">1500×1500 px, JPG/PNG</p>
                  </div>
                </div>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-accent transition-colors cursor-pointer">
                  <input
                    type="file"
                    id="cover-upload"
                    accept="image/*"
                    onChange={handleCoverUpload}
                    className="hidden"
                  />
                  <label htmlFor="cover-upload" className="cursor-pointer space-y-2 block">
                    {coverPreview ? (
                      <img
                        src={coverPreview}
                        alt="Cover preview"
                        className="w-32 h-32 mx-auto object-cover rounded-lg"
                      />
                    ) : (
                      <Icon name="ImagePlus" className="mx-auto text-muted-foreground" size={40} />
                    )}
                    {coverFile ? (
                      <p className="font-medium">{coverFile.name}</p>
                    ) : (
                      <div>
                        <p className="font-medium">Выберите изображение</p>
                        <p className="text-sm text-muted-foreground">Квадратное фото</p>
                      </div>
                    )}
                  </label>
                </div>
              </Card>
            </div>

            <Card className="p-8 space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="FileText" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-xl">Информация о треке</h3>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="track-name">Название трека *</Label>
                  <Input
                    id="track-name"
                    placeholder="Введите название трека"
                    value={trackName}
                    onChange={(e) => setTrackName(e.target.value)}
                    className="text-lg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="artist">Исполнитель</Label>
                  <Input
                    id="artist"
                    placeholder="Имя исполнителя (опционально)"
                    value={artist}
                    onChange={(e) => setArtist(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lyrics">Текст трека</Label>
                  <Textarea
                    id="lyrics"
                    placeholder="Текст песни (опционально)"
                    value={trackLyrics}
                    onChange={(e) => setTrackLyrics(e.target.value)}
                    rows={8}
                    className="font-mono text-sm"
                  />
                </div>
              </div>
            </Card>

            <div className="flex justify-center">
              <Button
                onClick={handleGenerateRelease}
                size="lg"
                className="gap-2 text-lg px-12 py-6 shadow-lg hover:shadow-xl transition-shadow"
              >
                <Icon name="Sparkles" size={20} />
                Сгенерировать релиз
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'upload' && showPreview && (
          <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold">Ваш релиз готов!</h2>
              <Button variant="ghost" onClick={() => setShowPreview(false)} className="gap-2">
                <Icon name="ArrowLeft" size={18} />
                Назад
              </Button>
            </div>

            <Card className="overflow-hidden shadow-2xl">
              <div className="aspect-square relative">
                {coverPreview && (
                  <img src={coverPreview} alt={trackName} className="w-full h-full object-cover" />
                )}
              </div>

              <div className="p-6 space-y-4 bg-card">
                {audioFile && (
                  <audio controls className="w-full">
                    <source src={URL.createObjectURL(audioFile)} type={audioFile.type} />
                  </audio>
                )}

                <div className="space-y-2">
                  <h3 className="text-2xl font-bold font-mono">{trackName}</h3>
                  {artist && <p className="text-muted-foreground font-mono">{artist}</p>}
                </div>

                {trackLyrics && (
                  <pre className="font-mono text-sm whitespace-pre-wrap bg-secondary/50 p-4 rounded-lg">
                    {trackLyrics}
                  </pre>
                )}
              </div>
            </Card>

            <Card className="p-6 space-y-4">
              <h3 className="font-semibold text-lg flex items-center gap-2">
                <Icon name="Share2" size={20} />
                Поделиться
              </h3>

              <div className="flex items-center gap-2">
                <Input value={window.location.href} readOnly className="flex-1" />
                <Button onClick={copyToClipboard} variant="outline" className="gap-2">
                  <Icon name="Copy" size={18} />
                  Копировать
                </Button>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button variant="outline" className="gap-2">
                  <Icon name="Send" size={18} />
                  Telegram
                </Button>
                <Button variant="outline" className="gap-2">
                  <Icon name="Share" size={18} />
                  ВКонтакте
                </Button>
                <Button variant="outline" className="gap-2">
                  <Icon name="Camera" size={18} />
                  Instagram
                </Button>
                <Button variant="outline" className="gap-2">
                  <Icon name="Twitter" size={18} />
                  Twitter
                </Button>
              </div>
            </Card>
          </div>
        )}

        {activeTab === 'releases' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <div className="text-center py-20 space-y-4">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto">
                <Icon name="Music" className="text-muted-foreground" size={40} />
              </div>
              <h2 className="text-2xl font-semibold">Пока нет релизов</h2>
              <p className="text-muted-foreground">
                Загрузите свой первый трек, чтобы начать
              </p>
              <Button onClick={() => setActiveTab('upload')} className="gap-2">
                <Icon name="Plus" size={18} />
                Загрузить трек
              </Button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
